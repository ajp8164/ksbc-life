import * as React from 'react';

import {
  FlatList,
  FlatListProps,
  InteractionManager,
  LayoutAnimation,
  LayoutChangeEvent,
  StatusBar,
  StatusBarProps,
  Text,
  View,
} from 'react-native';
import { Input, InputAdditionalProps, InputTopLevelProps } from '../Input';
import {
  KeyboardAccessoryView,
  useComponentSize,
} from '@flyerhq/react-native-keyboard-accessory-view';
import {
  L10nContext,
  ThemeContext,
  UserContext,
  calculateChatMessages,
  initLocale,
  unwrap,
} from '../../utils';
import { Message, MessageTopLevelProps } from '../Message';
import { MessageType, Theme, User } from '../../types';

import { CircularActivityIndicator } from '../CircularActivityIndicator';
import ImageView from './ImageView';
import calendar from 'dayjs/plugin/calendar';
import dayjs from 'dayjs';
import { defaultTheme } from '../../theme';
import { l10n } from '../../l10n';
import { oneOf } from '@flyerhq/react-native-link-preview';
import styles from './styles';
import { usePrevious } from '../../hooks';

// Untestable
/* istanbul ignore next */
const animate = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

dayjs.extend(calendar);

export type ChatTopLevelProps = InputTopLevelProps & MessageTopLevelProps;

export interface ChatProps extends ChatTopLevelProps {
  /** Allows you to replace the default Input widget e.g. if you want to create a channel view. */
  customBottomComponent?: () => React.ReactNode;
  /** If {@link ChatProps.dateFormat} and/or {@link ChatProps.timeFormat} is not enough to
   * customize date headers in your case, use this to return an arbitrary
   * string based on a `dateTime` of a particular message. Can be helpful to
   * return "Today" if `dateTime` is today. IMPORTANT: this will replace
   * all default date headers, so you must handle all cases yourself, like
   * for example today, yesterday and before. Or you can just return the same
   * date header for any message. */
  customDateHeaderText?: (dateTime: number) => string;
  /** Allows you to customize the date format. IMPORTANT: only for the date,
   * do not return time here. @see {@link ChatProps.timeFormat} to customize the time format.
   * @see {@link ChatProps.customDateHeaderText} for more customization. */
  dateFormat?: string;
  /** Disable automatic image preview on tap. */
  disableImageGallery?: boolean;
  /** Allows you to change what the user sees when there are no messages.
   * `emptyChatPlaceholder` and `emptyChatPlaceholderTextStyle` are ignored
   * in this case. */
  emptyState?: () => React.ReactNode;
  /** Use this to enable `LayoutAnimation`. Experimental on Android (same as React Native). */
  enableAnimation?: boolean;
  flatListProps?: Partial<FlatListProps<MessageType.DerivedAny[]>>;
  inputProps?: InputAdditionalProps;
  /** Used for pagination (infinite scroll) together with {@link ChatProps.onEndReached}.
   * When true, indicates that there are no more pages to load and
   * pagination will not be triggered. */
  isLastPage?: boolean;
  /** Override the default localized copy. */
  l10nOverride?: Partial<
    Record<keyof (typeof l10n)[keyof typeof l10n], string>
  >;
  locale?: keyof typeof l10n;
  messages: MessageType.Any[];
  /** Used for pagination (infinite scroll). Called when user scrolls
   * to the very end of the list (minus `onEndReachedThreshold`).
   * See {@link ChatProps.flatListProps} to set it up. */
  onEndReached?: () => Promise<void>;
  /** Show user names for received messages. Useful for a group chat. Will be
   * shown only on text messages. */
  showUserNames?: boolean;
  /** Chat theme. Implement {@link Theme} to create your own theme or use
   * existing one, like the {@link defaultTheme}. */
  theme?: Theme;
  /**
   * Allows you to customize the time format. IMPORTANT: only for the time,
   * do not return date here. @see {@link ChatProps.dateFormat} to customize the date format.
   * @see {@link ChatProps.customDateHeaderText} for more customization.
   */
  timeFormat?: string;
  user: User;
}

/** Entry component, represents the complete chat */
export const Chat = ({
  customBottomComponent,
  customDateHeaderText,
  dateFormat,
  disableImageGallery,
  emptyState,
  enableAnimation,
  flatListProps,
  inputProps,
  isAttachmentUploading,
  isLastPage,
  l10nOverride,
  locale = 'en',
  messages,
  onAttachmentPress,
  onEndReached,
  onMessageLongPress,
  onMessagePress,
  onPreviewDataFetched,
  onSendPress,
  renderBubble,
  renderCustomMessage,
  renderFileMessage,
  renderImageMessage,
  renderTextMessage,
  sendButtonVisibilityMode = 'editing',
  showUserAvatars = false,
  showUserNames = false,
  theme = defaultTheme,
  timeFormat,
  usePreviewData = true,
  user,
}: ChatProps) => {
  const {
    container,
    emptyComponentContainer,
    emptyComponentTitle,
    flatList,
    flatListContentContainer,
    footer,
    footerLoadingPage,
    header,
  } = styles({ theme });

  const { onLayout, size } = useComponentSize();
  const animationRef = React.useRef(false);
  const list = React.useRef<FlatList<MessageType.DerivedAny>>(null);
  const [isImageViewVisible, setIsImageViewVisible] = React.useState(false);
  const [isNextPageLoading, setNextPageLoading] = React.useState(false);
  const [imageViewIndex, setImageViewIndex] = React.useState(0);
  const [stackEntry, setStackEntry] = React.useState<StatusBarProps>({});
  const [composerHeight, setComposerHeight] = React.useState(0);

  const l10nValue = React.useMemo(
    () => ({ ...l10n[locale], ...unwrap(l10nOverride) }),
    [l10nOverride, locale],
  );

  const { chatMessages, gallery } = calculateChatMessages(messages, user, {
    customDateHeaderText,
    dateFormat,
    showUserNames,
    timeFormat,
  });

  const previousChatMessages = usePrevious(chatMessages);

  React.useEffect(() => {
    if (
      chatMessages[0]?.type !== 'dateHeader' &&
      chatMessages[0]?.id !== previousChatMessages?.[0]?.id &&
      chatMessages[0]?.author?.id === user.id
    ) {
      list.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages]);

  React.useEffect(() => {
    initLocale(locale);
  }, [locale]);

  // Untestable
  /* istanbul ignore next */
  if (animationRef.current && enableAnimation) {
    InteractionManager.runAfterInteractions(animate);
  }

  React.useEffect(() => {
    // Untestable
    /* istanbul ignore next */
    if (animationRef.current && enableAnimation) {
      InteractionManager.runAfterInteractions(animate);
    } else {
      animationRef.current = true;
    }
  }, [enableAnimation, messages]);

  const handleEndReached = React.useCallback(
    // Ignoring because `scroll` event for some reason doesn't trigger even basic
    // `onEndReached`, impossible to test.
    // TODO: Verify again later
    /* istanbul ignore next */
    async ({ distanceFromEnd }: { distanceFromEnd: number }) => {
      if (
        !onEndReached ||
        isLastPage ||
        distanceFromEnd <= 0 ||
        messages.length === 0 ||
        isNextPageLoading
      ) {
        return;
      }

      setNextPageLoading(true);
      await onEndReached?.();
      setNextPageLoading(false);
    },
    [isLastPage, isNextPageLoading, messages.length, onEndReached],
  );

  const handleImagePress = React.useCallback(
    (message: MessageType.Image) => {
      setImageViewIndex(
        gallery.findIndex(
          image => image.id === message.id && image.uri === message.uri,
        ),
      );
      setIsImageViewVisible(true);
      setStackEntry(
        StatusBar.pushStackEntry({
          barStyle: 'light-content',
          animated: true,
        }),
      );
    },
    [gallery],
  );

  const handleMessagePress = React.useCallback(
    (message: MessageType.Any) => {
      if (message.type === 'image' && !disableImageGallery) {
        handleImagePress(message);
      }
      onMessagePress?.(message);
    },
    [disableImageGallery, handleImagePress, onMessagePress],
  );

  // TODO: Tapping on a close button results in the next warning:
  // `An update to ImageViewing inside a test was not wrapped in act(...).`
  /* istanbul ignore next */
  const handleRequestClose = () => {
    setIsImageViewVisible(false);
    StatusBar.popStackEntry(stackEntry);
  };

  const keyExtractor = React.useCallback(
    ({ id }: MessageType.DerivedAny) => id,
    [],
  );

  const renderItem = React.useCallback(
    ({ item: message }: { item: MessageType.DerivedAny; index: number }) => {
      const messageWidth =
        showUserAvatars &&
        message.type !== 'dateHeader' &&
        message.author.id !== user.id
          ? Math.floor(Math.min(size.width * 0.72, 440))
          : Math.floor(Math.min(size.width * 0.77, 440));

      const roundBorder =
        message.type !== 'dateHeader' && message.nextMessageInGroup;
      const showAvatar =
        message.type !== 'dateHeader' && !message.nextMessageInGroup;
      const showName = message.type !== 'dateHeader' && message.showName;
      const showStatus = message.type !== 'dateHeader' && message.showStatus;

      return (
        <Message
          {...{
            enableAnimation,
            message,
            messageWidth,
            onMessageLongPress,
            onMessagePress: handleMessagePress,
            onPreviewDataFetched,
            renderBubble,
            renderCustomMessage,
            renderFileMessage,
            renderImageMessage,
            renderTextMessage,
            roundBorder,
            showAvatar,
            showName,
            showStatus,
            showUserAvatars,
            usePreviewData,
          }}
        />
      );
    },
    [
      enableAnimation,
      handleMessagePress,
      onMessageLongPress,
      onPreviewDataFetched,
      renderBubble,
      renderCustomMessage,
      renderFileMessage,
      renderImageMessage,
      renderTextMessage,
      showUserAvatars,
      size.width,
      usePreviewData,
      user.id,
    ],
  );

  const renderListEmptyComponent = React.useCallback(
    () => (
      <View style={emptyComponentContainer}>
        {oneOf(
          emptyState,
          <Text style={emptyComponentTitle}>
            {l10nValue.emptyChatPlaceholder}
          </Text>,
        )()}
      </View>
    ),
    [emptyComponentContainer, emptyComponentTitle, emptyState, l10nValue],
  );

  const renderListFooterComponent = React.useCallback(
    () =>
      // Impossible to test, see `handleEndReached` function
      /* istanbul ignore next */
      isNextPageLoading ? (
        <View style={footerLoadingPage}>
          <CircularActivityIndicator color={theme.colors.primary} size={16} />
        </View>
      ) : (
        <View style={footer} />
      ),
    [footer, footerLoadingPage, isNextPageLoading, theme.colors.primary],
  );

  const renderScrollable = React.useCallback(
    () => (
      <FlatList
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={[
          flatListContentContainer,
          { justifyContent: chatMessages.length !== 0 ? undefined : 'center' },
        ]}
        initialNumToRender={10}
        ListEmptyComponent={renderListEmptyComponent}
        ListFooterComponent={renderListFooterComponent}
        ListHeaderComponent={<View />}
        ListHeaderComponentStyle={header}
        maxToRenderPerBatch={6}
        onEndReachedThreshold={0.75}
        style={[flatList]}
        showsVerticalScrollIndicator={false}
        {...unwrap(flatListProps)}
        data={chatMessages}
        inverted
        keyboardDismissMode="none"
        keyExtractor={keyExtractor}
        onEndReached={handleEndReached}
        ref={list}
        renderItem={renderItem}
      />
    ),
    [
      chatMessages,
      flatList,
      flatListContentContainer,
      flatListProps,
      handleEndReached,
      header,
      keyExtractor,
      renderItem,
      renderListEmptyComponent,
      renderListFooterComponent,
    ],
  );

  return (
    <UserContext.Provider value={user}>
      <ThemeContext.Provider value={theme}>
        <L10nContext.Provider value={l10nValue}>
          <View style={container} onLayout={onLayout}>
            {customBottomComponent ? (
              <>
                <>{renderScrollable()}</>
                <>{customBottomComponent()}</>
              </>
            ) : (
              <KeyboardAccessoryView
                renderScrollable={renderScrollable}
                contentContainerStyle={{ marginBottom: 0 }}
                contentOffsetKeyboardClosed={composerHeight - 5}
                contentOffsetKeyboardOpened={23}
                spaceBetweenKeyboardAndAccessoryView={
                  -theme.composer.spaceBetweenKeyboardAndAccessoryView -
                  composerHeight
                }>
                <Input
                  {...{
                    ...unwrap(inputProps),
                    isAttachmentUploading,
                    onAttachmentPress,
                    onSendPress,
                    renderScrollable,
                    sendButtonVisibilityMode,
                    onLayout: (event: LayoutChangeEvent) => {
                      console.log('composer', event.nativeEvent.layout);
                      setComposerHeight(event.nativeEvent.layout.height);
                    },
                  }}
                />
              </KeyboardAccessoryView>
            )}
            <ImageView
              imageIndex={imageViewIndex}
              images={gallery}
              onRequestClose={handleRequestClose}
              visible={isImageViewVisible}
            />
          </View>
        </L10nContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
};

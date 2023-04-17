import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import { Header, HeaderBackButton } from '@react-navigation/elements';
import { Text, TouchableWithoutFeedback, View } from 'react-native';

import { ChatAvatar } from 'components/molecules/ChatAvatar';
import { EditGroupModal } from 'components/modals/EditGroupModal';
import { Group } from 'types/group';
import { fontSizes } from '@react-native-ajp-elements/ui';
import { getGroupName } from 'lib/group';
import { makeStyles } from '@rneui/themed';
import { useNavigation } from '@react-navigation/core';
import { useRef } from 'react';

interface ChatHeaderInterface {
  buttonIconName?: string;
  buttonIconColor?: string;
  buttonIconSize?: number;
  buttonIconType?: string;
  group: Group;
  onPressButton?: () => void;
}

export const ChatHeader = ({
  buttonIconName,
  buttonIconColor,
  buttonIconSize = 28,
  buttonIconType = 'material-community',
  group,
  onPressButton = () => {
    return;
  },
}: ChatHeaderInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);
  const navigation = useNavigation();

  const editGroupModalRef = useRef<EditGroupModal>(null);

  const renderBackButton = () => {
    return (
      <HeaderBackButton
        label={'Back'}
        labelVisible={true}
        tintColor={theme.colors.brandSecondary}
        style={{ top: 17 }}
        onPress={navigation.goBack}
      />
    );
  };

  const renderRightButton = () => {
    if (!buttonIconName) return null;
    return (
      <Button
        type={'clear'}
        containerStyle={{ top: 18 }}
        icon={
          <Icon
            name={buttonIconName}
            type={buttonIconType}
            color={buttonIconColor || theme.colors.brandSecondary}
            size={buttonIconSize}
          />
        }
        onPress={onPressButton}
      />
    );
  };

  const renderTitle = () => {
    return (
      <TouchableWithoutFeedback onPress={editGroupModalRef.current?.present}>
        <View style={s.container}>
          <ChatAvatar
            group={group}
            avatarStyle={theme.styles.avatarLarge}
            titleStyle={theme.styles.avatarTitleLarge}
          />
          <Text style={s.title}>{group && `${getGroupName(group)} >`}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <>
      <Header
        title={'Chat'}
        headerStyle={{ height: 140 }}
        headerShadowVisible={true}
        headerLeft={() => renderBackButton()}
        headerRight={() => renderRightButton()}
        headerTitle={() => renderTitle()}
      />
      <EditGroupModal ref={editGroupModalRef} group={group} />
    </>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  container: {
    alignItems: 'center',
    top: 17,
  },
  title: {
    ...theme.styles.textTiny,
    top: 5,
  },
  avatar: {
    width: 45,
    height: 45,
  },
  avatarTitle: {
    fontSize: fontSizes.xl,
  },
}));

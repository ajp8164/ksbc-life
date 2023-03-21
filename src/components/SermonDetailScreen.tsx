import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AppTheme, useTheme } from 'theme';
import {
  BulletList,
  openShareSheet,
  viewport,
} from '@react-native-ajp-elements/ui';
import { Button, Icon } from '@rneui/base';
import React, { useEffect, useRef } from 'react';

import Card from 'components/molecules/Card';
import { DateTime } from 'luxon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SermonsNavigatorParamList } from 'types/navigation';
import { TextModal } from 'components/modals/TextModal';
import { bibleReferenceToString } from 'lib/bible';
import { biometricAuthentication } from 'lib/biometricAuthentication';
import { makeStyles } from '@rneui/themed';
import { openURL } from '@react-native-ajp-elements/core';

export type Props = NativeStackScreenProps<
  SermonsNavigatorParamList,
  'SermonDetail'
>;

const SermonDetailScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const textModalRef = useRef<TextModal>(null);

  const sermon = route.params.sermon;
  const date = DateTime.fromISO(sermon.date).toFormat('MMM d, yyyy');

  const notes = [
    {
      id: '0',
      text: 'My note..',
      lastUpdated: '2023-02-20T05:37:18Z',
    },
    {
      id: '1',
      text: 'My second note..',
      lastUpdated: '2023-02-20T05:37:18Z',
    },
  ];

  useEffect(() => {
    navigation.setOptions({
      title: sermon.title,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmDeleteNote = async (id: string) => {
    await biometricAuthentication()
      .then(() => {
        Alert.alert(
          'Confirm Delete Note',
          'Are you sure you want to delete this note?',
          [
            {
              text: 'Yes, delete',
              onPress: () => doDeleteNote(id),
              style: 'destructive',
            },
            { text: 'No', style: 'cancel' },
          ],
          { cancelable: false },
        );
      })
      .catch();
  };

  const doDeleteNote = (id: string) => {
    console.log('delete note', id);
  };

  const saveNotes = (text: string) => {
    console.log('save note', text);
  };

  const renderDescriptionItem = (args: {
    iconName: string;
    iconType?: string;
    text: string;
    url?: string;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => args.url && openURL(args.url)}
        activeOpacity={args.url ? 0.2 : 1}>
        <View style={s.descriptionItemContainer}>
          <Icon
            name={args.iconName}
            type={args.iconType || 'material-community'}
            color={theme.colors.brandSecondary}
            size={28}
          />
          <Text style={s.descriptionItemText}>{args.text}</Text>
          {args.url && (
            <Icon
              name={'open-in-new'}
              type={'material-community'}
              color={theme.colors.text}
              size={12}
              containerStyle={{ left: 15, top: 8 }}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[theme.styles.view, { paddingHorizontal: 0 }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Text style={s.sermonTitle}>{sermon.title}</Text>
        <View style={{ paddingTop: 20 }}>
          <View style={{ alignItems: 'center' }}>
            <View>
              {sermon.bibleReference?.book &&
                renderDescriptionItem({
                  iconName: 'book-open-page-variant-outline',
                  text: bibleReferenceToString(sermon.bibleReference),
                  url: 'https://bible.com/bible/1713/jhn.2.13.CSB',
                })}
              {sermon.seriesTitle &&
                renderDescriptionItem({
                  iconName: 'sunny',
                  iconType: 'ionicon',
                  text: `Series: ${sermon.seriesTitle}`,
                })}
              {renderDescriptionItem({
                iconName: 'account-circle-outline',
                text: sermon.pasteur,
              })}
              {renderDescriptionItem({
                iconName: 'calendar-today',
                text: date,
              })}
            </View>
          </View>
          {sermon.lifeApplication?.title && (
            <Card
              header={'Life Application'}
              headerStyle={s.laHeader}
              title={sermon.lifeApplication?.title}
              titleStyle={s.laTitle}
              BodyComponent={
                sermon.lifeApplication && (
                  <View style={{ alignItems: 'center' }}>
                    <BulletList
                      containerStyle={{ marginTop: -10 }}
                      bulletStyle={s.laBullet}
                      type={'ordered'}
                      items={sermon.lifeApplication?.items.map(b => {
                        return <Text style={s.laBulletText}>{b}</Text>;
                      })}
                    />
                  </View>
                )
              }
              cardStyle={s.laCardStyle}
            />
          )}
        </View>
        <View style={s.sectionHeaderContainer}>
          <Text style={s.sectionHeaderTitle}>{'SERMON NOTES'}</Text>
          <Button
            type={'clear'}
            title={'Add Note'}
            titleStyle={theme.styles.buttonClearTitle}
            buttonStyle={s.addNoteButton}
            containerStyle={s.addNoteButtonContainer}
            onPress={() => textModalRef.current?.present()}
          />
        </View>
        {notes.length > 0 ? (
          notes.map(note => {
            return (
              <Card
                key={note.id}
                cardStyle={s.noteCard}
                body={note.text}
                footer={`Updated: ${DateTime.fromISO(note.lastUpdated).toFormat(
                  'MMM dd, yyyy',
                )}`}
                footerStyle={s.noteFooter}
                buttons={[
                  {
                    label: 'Share',
                    icon: 'share-variant',
                    onPress: () => {
                      openShareSheet({
                        title: 'John 3:16 CSB',
                        message:
                          'For God loved the world in this way: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.',
                      });
                    },
                  },
                  {
                    label: 'Edit',
                    icon: 'note-edit-outline',
                    onPress: () => {
                      console.log('edit');
                    },
                  },
                  {
                    label: 'Delete',
                    icon: 'trash-can-outline',
                    onPress: () => {
                      confirmDeleteNote(note.id);
                    },
                  },
                ]}
              />
            );
          })
        ) : (
          <Text style={s.noNotesText}>
            {'Hey! How about writing\nsome notes about this sermon?'}
          </Text>
        )}
      </ScrollView>
      <TextModal
        ref={textModalRef}
        placeholder={'Type your notes here'}
        onDismiss={saveNotes}
      />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  sectionHeaderContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    height: 40,
    marginHorizontal: 5,
    paddingTop: 20,
    backgroundColor: theme.colors.listHeaderBackground,
    width: viewport.width - 40,
    alignSelf: 'center',
  },
  sectionHeaderTitle: {
    ...theme.styles.textSmall,
    ...theme.styles.textBold,
    color: theme.colors.textDim,
  },
  addNoteButtonContainer: {},
  addNoteButton: {
    ...theme.styles.buttonClear,
    minWidth: 0,
    paddingRight: 0,
    justifyContent: 'flex-end',
    top: -12,
  },
  descriptionItemContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  descriptionItemText: {
    ...theme.styles.textNormal,
    top: 4,
    left: 10,
  },
  sermonTitle: {
    ...theme.styles.textHeading4,
    ...theme.styles.textBold,
    color: theme.colors.brandSecondary,
    alignSelf: 'center',
    paddingTop: 20,
  },
  laHeader: {
    ...theme.styles.textSmall,
    color: theme.colors.whiteTransparentDark,
  },
  laTitle: {
    ...theme.styles.textHeading5,
    color: theme.colors.stickyWhite,
    marginTop: 15,
  },
  laBullet: {
    ...theme.styles.textNormal,
    ...theme.styles.textBold,
    color: theme.colors.stickyWhite,
  },
  laBulletText: {
    ...theme.styles.textNormal,
    color: theme.colors.stickyWhite,
  },
  laCardStyle: {
    paddingBottom: 20,
    marginTop: 35,
    marginBottom: 30,
    backgroundColor: theme.colors.brandPrimary,
    ...theme.styles.viewWidth,
  },
  noteCard: {
    marginTop: 25,
    ...theme.styles.viewWidth,
  },
  noteFooter: {
    ...theme.styles.textSmall,
    alignSelf: 'flex-start',
  },
  noNotesText: {
    ...theme.styles.textNormal,
    textAlign: 'center',
    marginTop: 30,
  },
}));

export default SermonDetailScreen;

import { Alert, ScrollView } from 'react-native';
import { AppTheme, useTheme } from 'theme';
import {
  Divider,
  ListItem,
  openShareSheet,
} from '@react-native-ajp-elements/ui';
import React, { useEffect, useRef } from 'react';

import Card from 'components/molecules/Card';
import { DateTime } from 'luxon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SermonsNavigatorParamList } from 'types/navigation';
import { TextModal } from 'components/modals/TextModal';
import { biometricAuthentication } from 'lib/biometricAuthentication';
import { makeStyles } from '@rneui/themed';

export type Props = NativeStackScreenProps<
  SermonsNavigatorParamList,
  'SermonDetail'
>;

const SermonDetailScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  console.log(route.params.id);
  const textModalRef = useRef<TextModal>(null);

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
      title: 'Be Patient',
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
            {
              text: 'No',
              style: 'cancel',
            },
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

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Divider />
        <ListItem
          title={'Add New Notes'}
          position={['first', 'last']}
          onPress={() => textModalRef.current?.present()}
        />
        <Divider text={'SERMON NOTES'} />
        {notes.map(note => {
          return (
            <Card
              key={note.id}
              body={note.text}
              footer={`Updated: ${DateTime.fromISO(note.lastUpdated).toFormat(
                'MMM dd, yyyy',
              )}`}
              footerStyle={{
                ...theme.styles.textNormal,
                alignSelf: 'flex-start',
              }}
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
        })}
      </ScrollView>
      <TextModal
        ref={textModalRef}
        placeholder={'Type your notes here'}
        onDismiss={saveNotes}
      />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  text: {},
}));

export default SermonDetailScreen;

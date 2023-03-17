import { AppTheme, useTheme } from 'theme';
import { ListItemAccordian, viewport } from '@react-native-ajp-elements/ui';
import { ScrollView, View } from 'react-native';

import { BibleReferencePickerNavigatorParamList } from './types';
import { Button } from '@rneui/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { bible } from 'lib/content/bible';
import { makeStyles } from '@rneui/themed';

type Props = NativeStackScreenProps<
  BibleReferencePickerNavigatorParamList,
  'BibleBookChaptersScreen'
>;

const buttonSize = 65;
const buttonPadding = 5;
const viewPad = (viewport.width % (buttonSize + buttonPadding * 2)) / 2;

const BibleBookChaptersScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: theme.colors.white }}
      contentContainerStyle={{ paddingBottom: 50 }}
      contentInsetAdjustmentBehavior={'automatic'}>
      {bible.map(book => {
        return (
          <ListItemAccordian
            key={book.name}
            title={book.name}
            titleStyle={theme.styles.textNormal}
            containerStyle={s.bookListItemContainer}>
            <View style={s.buttonsContainer}>
              {book.chapters.map((_chapter, chapterIndex) => {
                return (
                  <Button
                    key={chapterIndex}
                    title={(chapterIndex + 1).toString()}
                    titleStyle={{ color: theme.colors.text }}
                    buttonStyle={s.button}
                    containerStyle={{ padding: buttonPadding }}
                    onPress={() => {
                      navigation.navigate('BibleVersesScreen', {
                        book: book.name,
                        chapter: (chapterIndex + 1).toString(),
                        verseCount: book.chapters[chapterIndex],
                      });
                    }}
                  />
                );
              })}
            </View>
          </ListItemAccordian>
        );
      })}
    </ScrollView>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  bookListItemContainer: {
    borderColor: 'transparent',
    height: 45,
    paddingVertical: 0,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: viewPad,
    backgroundColor: theme.colors.white,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.colors.blackTransparentSubtle,
    backgroundColor: theme.colors.hintGray,
  },
}));

export default BibleBookChaptersScreen;

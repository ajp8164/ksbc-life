import { AppTheme, useTheme } from 'theme';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { BibleVerse } from 'types/bible';
import { BibleVerseContext } from './BibleVersePickerModal';
import { BibleVersePickerNavigatorParamList } from './types';
import { Button } from '@rneui/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { makeStyles } from '@rneui/themed';
import { viewport } from '@react-native-ajp-elements/ui';

type Props = NativeStackScreenProps<
  BibleVersePickerNavigatorParamList,
  'BibleVersesScreen'
>;

const buttonSize = 65;
const buttonPadding = 5;
const viewPad = (viewport.width % (buttonSize + buttonPadding * 2)) / 2;

const BibleVersesScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const dismiss = useContext(BibleVerseContext);

  const [startVerse, setStartVerse] = useState('');
  const [endVerse, setEndVerse] = useState('');
  const [verseSpan, setVerseSpan] = useState('');

  const verses = Array.from(
    { length: route.params?.verseCount },
    (_, i) => i + 1,
  );

  const result = {
    book: route.params?.book,
    chapter: route.params?.chapter,
    verse: {
      start: startVerse,
      end: endVerse,
    },
  } as BibleVerse;

  navigation.setOptions({
    // eslint-disable-next-line react/no-unstable-nested-components
    headerRight: () => (
      <>
        <Button
          type={'clear'}
          title={'Single Verse'}
          disabled={result.verse.start === ''}
          onPress={() => dismiss.dismiss(result)}
        />
      </>
    ),
  });

  useEffect(() => {
    let vs = '';
    if (startVerse) {
      vs = `: ${startVerse}`;
    }
    if (endVerse) {
      vs = `${vs}-${endVerse}`;
    }
    setVerseSpan(vs);
  }, [startVerse, endVerse]);

  const determineSpan = (verse: number) => {
    if (endVerse !== '') {
      setStartVerse(verse.toString());
      setEndVerse('');
    } else {
      if (startVerse === '') {
        setStartVerse(verse.toString());
      } else if (endVerse === '') {
        if (verse < Number(startVerse)) {
          setStartVerse(verse.toString());
        } else if (verse === Number(startVerse)) {
          // Disallow verse span from n to n.
        } else {
          setEndVerse(verse.toString());
          result.verse.end = verse.toString();
          setTimeout(() => {
            dismiss.dismiss(result);
          }, 750); // A bit of time to get visual feedback on selection before dismissal.
        }
      }
    }
  };

  return (
    <View>
      <Text
        style={[
          theme.styles.textNormal,
          { textAlign: 'center', paddingVertical: 10 },
        ]}>{`${route.params?.book} ${route.params?.chapter}${verseSpan}`}</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.view}>
        {verses.map((_verse, verseIndex) => {
          return (
            <Button
              key={verseIndex}
              title={(verseIndex + 1).toString()}
              titleStyle={{ color: theme.colors.text }}
              buttonStyle={[
                s.button,
                verseIndex + 1 === Number(startVerse) ||
                (verseIndex + 1 >= Number(startVerse) &&
                  verseIndex + 1 <= Number(endVerse))
                  ? { backgroundColor: theme.colors.brandSecondary }
                  : {},
              ]}
              containerStyle={{ padding: buttonPadding }}
              onPress={() => determineSpan(verseIndex + 1)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  view: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: viewPad,
    backgroundColor: theme.colors.hintGray,
    paddingBottom: 50,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    backgroundColor: theme.colors.hintGray,
    borderWidth: 1,
    borderColor: theme.colors.blackTransparentSubtle,
    borderRadius: 5,
  },
}));

export default BibleVersesScreen;

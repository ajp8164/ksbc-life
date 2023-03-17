import { AppTheme, useTheme } from 'theme';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';

import { BibleReference } from 'types/bible';
import { BibleReferenceContext } from './BibleReferencePickerModal';
import { BibleReferencePickerNavigatorParamList } from './types';
import { Button } from '@rneui/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { makeStyles } from '@rneui/themed';
import { viewport } from '@react-native-ajp-elements/ui';

type Props = NativeStackScreenProps<
  BibleReferencePickerNavigatorParamList,
  'BibleVersesScreen'
>;

const buttonSize = 65;
const buttonPadding = 5;
const viewPad = (viewport.width % (buttonSize + buttonPadding * 2)) / 2;

const BibleVersesScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const bibleReferenceContext = useContext(BibleReferenceContext);

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
  } as BibleReference;

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <Button
          type={'clear'}
          title={'Single Verse'}
          disabled={result.verse.start === ''}
          onPress={() => bibleReferenceContext.setResult(result)}
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  useEffect(() => {
    let vs = '';
    if (startVerse) {
      vs = `:${startVerse}`;
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
            bibleReferenceContext.setResult(result);
          }, 900); // A bit of time to get visual feedback on selection before dismissal.
        }
      }
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: theme.colors.white }}
      contentContainerStyle={s.view}
      contentInsetAdjustmentBehavior={'automatic'}>
      <Text
        style={
          s.selectionText
        }>{`${route.params?.book} ${route.params?.chapter}${verseSpan}`}</Text>
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
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  view: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: viewPad,
    backgroundColor: theme.colors.white,
    paddingBottom: 50,
  },
  selectionText: {
    ...theme.styles.textNormal,
    textAlign: 'center',
    paddingVertical: 10,
    backgroundColor: theme.colors.white,
    width: '100%',
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

import { AppTheme, useTheme } from 'theme';
import {
  EditorState,
  ScreenContentItemScheduleEditorViewMethods,
  ScreenContentItemScheduleEditorViewProps,
} from './types';
import React, { useImperativeHandle } from 'react';

import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Text } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { useSetState } from '@react-native-ajp-elements/core';

type ScreenContentItemScheduleEditorView =
  ScreenContentItemScheduleEditorViewMethods;

const ScreenContentItemScheduleEditorView = React.forwardRef<
  ScreenContentItemScheduleEditorView,
  ScreenContentItemScheduleEditorViewProps
>((props, ref) => {
  const { containerStyle, onChange, screenContentItem } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const [editorState, _setEditorState] = useSetState<EditorState>({
    fieldCount: 0,
    focusedField: undefined,
    isSubmitting: false,
    changed: false,
  });

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    saveScreenContentItem,
  }));

  const saveScreenContentItem = async () => {
    return;
  };

  return (
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={containerStyle}>
      <Text style={s.hello}>{'hello'}</Text>
      <Text onPress={() => onChange && onChange(editorState)}>
        {screenContentItem?.name}
      </Text>
    </BottomSheetScrollView>
  );
});

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  hello: {},
}));

export default ScreenContentItemScheduleEditorView;

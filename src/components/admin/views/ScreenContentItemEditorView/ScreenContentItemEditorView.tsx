import { AppTheme, useTheme } from 'theme';
import React, { useImperativeHandle, useRef } from 'react';
import {
  ScreenContentItemEditorViewMethods,
  ScreenContentItemEditorViewProps,
} from './types';

import ScreenContentItemContentEditorView from 'components/admin/views/ScreenContentItemContentEditorView';
import ScreenContentItemScheduleEditorView from 'components/admin/views/ScreenContentItemScheduleEditorView';
import { TabController } from 'react-native-ui-lib';
import { View } from 'react-native';
import { makeStyles } from '@rneui/themed';

type ScreenContentItemEditorView = ScreenContentItemEditorViewMethods;

const ScreenContentItemEditorView = React.forwardRef<
  ScreenContentItemEditorView,
  ScreenContentItemEditorViewProps
>((props, ref) => {
  const { contentContainerStyle, onChange, screenContentItem } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const screenContentItemContentEditorViewRef =
    useRef<ScreenContentItemContentEditorView>(null);
  const screenContentItemScheduleEditorViewRef =
    useRef<ScreenContentItemScheduleEditorView>(null);

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    saveScreenContentItem,
  }));

  const saveScreenContentItem = async () => {
    // Save both editors. This creates two firestore writes; might be a better way to do this in one write.
    return screenContentItemContentEditorViewRef.current
      ?.saveScreenContentItem()
      .then(() =>
        screenContentItemScheduleEditorViewRef.current?.saveScreenContentItem(),
      );
  };

  return (
    <View style={[theme.styles.view, { paddingHorizontal: 0 }]}>
      <TabController items={[{ label: 'Editor' }, { label: 'Schedule' }]}>
        <TabController.TabBar
          backgroundColor={theme.colors.viewBackground}
          indicatorStyle={{ backgroundColor: theme.colors.brandSecondary }}
          labelColor={theme.colors.text}
          selectedLabelColor={theme.colors.text}
        />
        <TabController.TabPage index={0}>
          <View style={contentContainerStyle}>
            <ScreenContentItemContentEditorView
              ref={screenContentItemContentEditorViewRef}
              containerStyle={s.contentContainer}
              screenContentItem={screenContentItem}
              onChange={onChange}
            />
          </View>
        </TabController.TabPage>
        <TabController.TabPage index={1}>
          <View style={contentContainerStyle}>
            <ScreenContentItemScheduleEditorView
              ref={screenContentItemScheduleEditorViewRef}
              containerStyle={s.contentContainer}
              screenContentItem={screenContentItem}
              onChange={onChange}
            />
          </View>
        </TabController.TabPage>
      </TabController>
    </View>
  );
});

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  contentContainer: {
    marginTop: theme.styles.topTabBar.height,
    flex: 1,
    marginBottom: 50,
  },
}));

export default ScreenContentItemEditorView;

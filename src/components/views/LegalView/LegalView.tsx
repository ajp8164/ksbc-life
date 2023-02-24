import { AppTheme, useTheme } from 'theme';
import { Text, View } from 'react-native';

import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ContentView } from '@react-native-ajp-elements/ui';
import React from 'react';
import { TabController } from 'react-native-ui-lib';
import { appConfig } from 'config';
import { makeStyles } from '@rneui/themed';
import privacy from 'lib/content/privacy';
import terms from 'lib/content/terms';

const LegalView = () => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <View style={{ height: '100%' }}>
      <TabController
        items={[{ label: 'Service Agreement' }, { label: 'Privacy Policy' }]}>
        <TabController.TabBar
          backgroundColor={theme.colors.viewInvBackground}
          indicatorStyle={{ backgroundColor: theme.colors.stickyWhite }}
          labelColor={theme.colors.textInv}
          selectedLabelColor={theme.colors.textInv}
        />
        <TabController.TabPage index={0}>
          <BottomSheetScrollView
            style={s.tabContentContainer}
            showsVerticalScrollIndicator={false}>
            <Text style={s.title}>
              {`${appConfig.businessNameShort} \nService Agreement`}
            </Text>
            <ContentView items={terms} textStyle={s.text} />
          </BottomSheetScrollView>
        </TabController.TabPage>
        <TabController.TabPage index={1}>
          <BottomSheetScrollView
            style={s.tabContentContainer}
            showsVerticalScrollIndicator={false}>
            <Text style={s.title}>
              {`${appConfig.businessNameShort} \nPrivacy Policy`}
            </Text>
            <ContentView items={privacy} textStyle={s.text} />
          </BottomSheetScrollView>
        </TabController.TabPage>
      </TabController>
    </View>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  tabContentContainer: {
    top: 48 + 10, // tab bar height plus some margin
    marginHorizontal: 15,
  },
  title: {
    ...theme.styles.textHeading1,
    color: theme.colors.textInv,
  },
  text: {
    ...theme.styles.textSmall,
    color: theme.colors.textInv,
  },
}));

export default LegalView;

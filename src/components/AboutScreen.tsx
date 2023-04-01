import { AppTheme, useTheme } from 'theme';
import { Divider, ListItem, viewport } from '@react-native-ajp-elements/ui';
import { ScrollView, Text } from 'react-native';

import { MoreNavigatorParamList } from 'types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import VersionNumber from 'react-native-version-number';
import helpContent from 'lib/content/helpContent';
import legalContent from 'lib/content/legalContent';
import { makeStyles } from '@rneui/themed';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export type Props = NativeStackScreenProps<MoreNavigatorParamList, 'About'>;

const AboutScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const tabBarHeight = useBottomTabBarHeight();
  const headerBarLargeHeight = theme.styles.headerBarLarge.height as number;
  const visibleViewHeight =
    viewport.height - tabBarHeight - headerBarLargeHeight;

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        contentContainerStyle={{ height: visibleViewHeight }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Divider />
        <ListItem
          title={'Help'}
          position={['first']}
          onPress={() =>
            navigation.navigate('Content', {
              content: helpContent,
            })
          }
        />
        <ListItem
          title={'Legal'}
          position={['last']}
          onPress={() =>
            navigation.navigate('Content', {
              content: legalContent,
            })
          }
        />
        <Divider
          type={'note'}
          text={
            'This log shows the activity of the application and can be useful for app support.'
          }
        />
        <Text style={s.version}>
          {`App Version ${VersionNumber.appVersion}.${VersionNumber.buildVersion}`}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  version: {
    position: 'absolute',
    bottom: 15,
    ...theme.styles.textSmall,
    ...theme.styles.textDim,
    alignSelf: 'center',
    marginTop: 25,
  },
}));

export default AboutScreen;

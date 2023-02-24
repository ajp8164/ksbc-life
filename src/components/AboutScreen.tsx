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
import { useHeaderHeight } from '@react-navigation/elements';

export type Props = NativeStackScreenProps<MoreNavigatorParamList, 'About'>;

const AboutScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const iosLargeTitleHeight = 52;
  const visibleViewHeight =
    viewport.height - headerHeight - tabBarHeight - iosLargeTitleHeight;

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
        {/* <Divider />
        <ListItem
          title={'Theme'}
          position={['first', 'last']}
          onPress={async () => navigation.navigate('Theme')}
        /> */}
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

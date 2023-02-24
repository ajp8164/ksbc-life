import { Divider, ListItemSwitch } from '@react-native-ajp-elements/ui';
import React, { useState } from 'react';
import { ScrollView, View, useColorScheme } from 'react-native';
import { saveBiometrics, saveThemeSettings } from 'store/slices/appSettings';
import {
  selectBiometrics,
  selectThemeSettings,
} from 'store/selectors/appSettingsSelectors';
import { useDispatch, useSelector } from 'react-redux';

import { biometricAuthentication } from 'lib/biometricAuthentication';
import { useTheme } from 'theme';

const AppSettings = () => {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const dispatch = useDispatch();
  const themeSettings = useSelector(selectThemeSettings);
  const biometrics = useSelector(selectBiometrics);

  const [biometricsValue, setBiometricsValue] = useState(biometrics);

  const toggleAppearance = (value: boolean) => {
    dispatch(
      saveThemeSettings({
        themeSettings: { ...themeSettings, app: value ? 'dark' : 'light' },
      }),
    );
    theme.updateTheme({ mode: value ? 'dark' : 'light' });
  };

  const toggleBiometrics = async (value: boolean) => {
    setBiometricsValue(value);
    if (value === false) {
      // Require biometrics to turn off feature.
      await biometricAuthentication()
        .then(() => {
          dispatch(saveBiometrics({ value }));
        })
        .catch(() => {
          setBiometricsValue(true);
        });
    } else {
      dispatch(saveBiometrics({ value }));
    }
  };

  const toggleUseDevice = (value: boolean) => {
    dispatch(
      saveThemeSettings({
        themeSettings: { ...themeSettings, followDevice: value },
      }),
    );
    const control = value ? colorScheme : themeSettings.app;
    theme.updateTheme({ mode: control === 'dark' ? 'dark' : 'light' });
  };

  return (
    <View style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Divider text={'SECURITY'} />
        <ListItemSwitch
          title={'Use Biometrics ID'}
          value={biometricsValue}
          position={['first', 'last']}
          onValueChange={toggleBiometrics}
        />
        <Divider
          type={'note'}
          text={
            'Biometrics enable face recognition or fingerprint. When enabled biometrics protects changes to your profile, access to your private key, ability to withdraw funds, disabling privacy mode and access to the app log.'
          }
        />
        <Divider text={'APPEARANCE'} />
        <ListItemSwitch
          title={'Dark Appearance'}
          value={themeSettings.app === 'dark'}
          disabled={themeSettings.followDevice}
          position={['first']}
          onValueChange={toggleAppearance}
        />
        <ListItemSwitch
          title={'Use Device Setting'}
          value={themeSettings.followDevice}
          position={['last']}
          onValueChange={toggleUseDevice}
        />
      </ScrollView>
    </View>
  );
};

export default AppSettings;

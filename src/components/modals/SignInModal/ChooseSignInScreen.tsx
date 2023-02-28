import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppTheme, useTheme } from 'theme';
import { Text, View } from 'react-native';

import React from 'react';
import { makeStyles } from '@rneui/themed';
import { Button } from '@rneui/base';
import { SvgXml } from 'react-native-svg';
import { getSvg } from '@react-native-ajp-elements/ui';
import { appConfig } from 'config';
import { signInWithGoogle, signOut } from 'lib/userAuthentication';
import { SignInNavigatorParamList } from './types';

export type Props = NativeStackScreenProps<
  SignInNavigatorParamList,
  'ChooseSignInScreen'
>;

const ChooseSignInScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <View style={theme.styles.viewAlt}>
      <Text style={s.title}>{appConfig.businessName}</Text>
      <Text style={s.description}>{'Sign in to take notes.'}</Text>
      <Text style={s.subtitle}>{'Create Account'}</Text>
      <Text style={s.footer}>
        {'By signing up you agree to our Terms and Privacy Policy'}
      </Text>
      <Button
        title={'Continue with Google'}
        titleStyle={theme.styles.buttonOutlineTitle}
        buttonStyle={theme.styles.buttonOutline}
        containerStyle={s.signInButtonContainer}
        icon={
          <SvgXml
            width={28}
            height={28}
            style={{ position: 'absolute', left: 5 }}
            xml={getSvg('googleIcon')}
          />
        }
        onPress={signInWithGoogle}
      />
      <Button
        title={'Continue with Facebook'}
        titleStyle={theme.styles.buttonOutlineTitle}
        buttonStyle={theme.styles.buttonOutline}
        containerStyle={s.signInButtonContainer}
        icon={
          <SvgXml
            width={28}
            height={28}
            style={{ position: 'absolute', left: 5 }}
            xml={getSvg('facebookIcon')}
          />
        }
      />
      <Button
        title={'Continue with Twitter'}
        titleStyle={theme.styles.buttonOutlineTitle}
        buttonStyle={theme.styles.buttonOutline}
        containerStyle={s.signInButtonContainer}
        icon={
          <SvgXml
            width={28}
            height={28}
            style={{ position: 'absolute', left: 5 }}
            xml={getSvg('twitterIcon')}
          />
        }
      />
      <Button
        title={'Continue with Apple'}
        titleStyle={theme.styles.buttonOutlineTitle}
        buttonStyle={theme.styles.buttonOutline}
        containerStyle={s.signInButtonContainer}
        icon={
          <SvgXml
            width={28}
            height={28}
            style={{ position: 'absolute', left: 5 }}
            xml={getSvg('appleIcon')}
          />
        }
      />
      <Button
        title={'Continue with Email'}
        titleStyle={theme.styles.buttonOutlineTitle}
        buttonStyle={theme.styles.buttonOutline}
        containerStyle={s.signInButtonContainer}
        onPress={() => navigation.navigate('EmailSignInScreen')}
      />
      <Button
        title={'OR SIGN IN'}
        titleStyle={theme.styles.buttonClearTitle}
        buttonStyle={theme.styles.buttonClear}
        containerStyle={s.signInButtonContainer}
      />
      <Button
        title={'SIGN OUT'}
        titleStyle={theme.styles.buttonClearTitle}
        buttonStyle={theme.styles.buttonClear}
        containerStyle={s.signInButtonContainer}
        onPress={signOut}
      />
    </View>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  description: {
    ...theme.styles.textNormal,
    ...theme.styles.textDim,
    textAlign: 'center',
    marginHorizontal: 40,
  },
  footer: {
    ...theme.styles.textSmall,
    ...theme.styles.textDim,
    alignSelf: 'center',
    textAlign: 'center',
    position: 'absolute',
    bottom: 40,
    marginHorizontal: 40,
  },
  signInButtonContainer: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: 15,
  },
  subtitle: {
    ...theme.styles.textHeading3,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    ...theme.styles.textHeading1,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
}));

export default ChooseSignInScreen;

import { AppTheme, useTheme } from 'theme';
import {
  MoreNavigatorParamList,
  MainNavigatorParamList,
} from 'types/navigation';
import { ScrollView, View } from 'react-native';
import React, { useEffect } from 'react';
import { makeStyles } from '@rneui/themed';
import { CompositeScreenProps } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { selectUser } from 'store/selectors/userProfileSelectors';
import { Button } from '@rneui/base';
import { signOut } from 'lib/userAuthentication';

type Props = CompositeScreenProps<
  NativeStackScreenProps<MoreNavigatorParamList, 'UserProfile'>,
  NativeStackScreenProps<MainNavigatorParamList>
>;

const UserProfileScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const user = useSelector(selectUser);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: user?.displayName || '',
    });
  });

  const doSignOut = () => {
    signOut()
      .then(() => {
        navigation.goBack();
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        console.log(e.message);
      });
  };

  return (
    <View>
      <ScrollView
        style={theme.styles.view}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Button
          title={'SIGN OUT'}
          titleStyle={theme.styles.buttonClearTitle}
          buttonStyle={theme.styles.buttonClear}
          containerStyle={s.signInButtonContainer}
          onPress={doSignOut}
        />
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  signInButtonContainer: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: 15,
  },
}));

export default UserProfileScreen;

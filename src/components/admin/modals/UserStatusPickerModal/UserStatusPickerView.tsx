import { AppTheme, useTheme } from 'theme';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { CheckBox } from '@rneui/base';
import { UserStatus } from 'types/user';
import { makeStyles } from '@rneui/themed';

interface UserStatusPickerInterface {
  disabled: boolean;
  onChange: (userStatus: UserStatus) => void;
  value: UserStatus;
}

const descriptions = {
  [UserStatus.Active]: 'User is able to sign in.',
  [UserStatus.Disabled]: 'User is not able to sign in.',
};

const UserStatusPickerView = ({
  disabled,
  onChange,
  value,
}: UserStatusPickerInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const [userStatus, setUserStatus] = useState<UserStatus>(value);

  useEffect(() => {
    onChange(userStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStatus]);

  return (
    <View style={theme.styles.viewAlt}>
      {(Object.keys(UserStatus) as Array<keyof typeof UserStatus>).map(
        (st, index) => {
          return (
            <View key={index}>
              <CheckBox
                title={UserStatus[st]}
                textStyle={theme.styles.textNormal}
                containerStyle={{
                  padding: 0,
                  backgroundColor: theme.colors.transparent,
                }}
                disabled={disabled}
                checkedColor={theme.colors.brandSecondary}
                checked={value === UserStatus[st]}
                onPress={() => setUserStatus(UserStatus[st])}
              />
              <Text style={s.description}>{descriptions[UserStatus[st]]}</Text>
            </View>
          );
        },
      )}
      {disabled && (
        <Text style={s.note}>
          {'Note: Owners and administrators cannot change their own status.'}
        </Text>
      )}
    </View>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  description: {
    ...theme.styles.textSmall,
    ...theme.styles.textDim,
    paddingLeft: 45,
  },
  note: {
    ...theme.styles.textSmall,
    ...theme.styles.textDim,
    paddingLeft: 10,
    marginTop: 25,
  },
}));

export default UserStatusPickerView;

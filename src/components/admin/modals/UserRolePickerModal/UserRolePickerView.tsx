import { AppTheme, useTheme } from 'theme';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { CheckBox } from '@rneui/base';
import { UserRole } from 'types/user';
import { makeStyles } from '@rneui/themed';

interface UserRolePickerInterface {
  disabled: boolean;
  onChange: (userRole: UserRole) => void;
  value: UserRole;
}

const descriptions = {
  [UserRole.Admin]:
    'All privileges of User plus access the administration area of the app.',
  [UserRole.Owner]:
    'All privileges of Administrator plus ability to convey Administrator role to users.',
  [UserRole.User]: 'Can access the app.',
};

const UserRolePickerView = ({
  disabled,
  onChange,
  value,
}: UserRolePickerInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const [userRole, setUserRole] = useState<UserRole>(value);

  useEffect(() => {
    onChange(userRole);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  return (
    <View style={theme.styles.viewAlt}>
      {(Object.keys(UserRole) as Array<keyof typeof UserRole>).map(
        (r, index) => {
          return (
            <View key={index}>
              <CheckBox
                title={UserRole[r]}
                textStyle={theme.styles.textNormal}
                containerStyle={{
                  borderWidth: 1,
                  padding: 0,
                }}
                // Owner role is always disabled. Changing requires direct database access by support.
                disabled={disabled || UserRole[r] === UserRole.Owner}
                checkedColor={theme.colors.brandSecondary}
                checked={value === UserRole[r]}
                onPress={() => setUserRole(UserRole[r])}
              />
              <Text style={s.description}>{descriptions[UserRole[r]]}</Text>
            </View>
          );
        },
      )}
      {disabled && (
        <Text style={s.note}>
          {'Note: Owners and administrators cannot change their own role.'}
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

export default UserRolePickerView;

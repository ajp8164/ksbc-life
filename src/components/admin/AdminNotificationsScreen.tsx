import { Divider, ListItem } from '@react-native-ajp-elements/ui';

import { MoreNavigatorParamList } from 'types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { useTheme } from 'theme';

type Props = NativeStackScreenProps<
  MoreNavigatorParamList,
  'AdminNotifications'
>;

const AdminNotificationsScreen = ({ navigation }: Props) => {
  const theme = useTheme();

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Divider />
        <ListItem
          title={'Hello'}
          position={['first', 'last']}
          leftImage={'human-greeting'}
          leftImageType={'material-community'}
          onPress={() => navigation.navigate('AdminNotifications')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminNotificationsScreen;

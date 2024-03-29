import { Divider, ListItem } from '@react-native-ajp-elements/ui';

import { MoreNavigatorParamList } from 'types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { useTheme } from 'theme';

type Props = NativeStackScreenProps<MoreNavigatorParamList, 'AdminHome'>;

const AdminHomeScreen = ({ navigation }: Props) => {
  const theme = useTheme();

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Divider />
        <ListItem
          title={'Church'}
          position={['first']}
          leftImage={'church'}
          leftImageType={'material-community'}
          onPress={() => navigation.navigate('AdminChurch')}
        />
        <ListItem
          title={'Pastors'}
          leftImage={'account-outline'}
          leftImageType={'material-community'}
          onPress={() => navigation.navigate('AdminPastors')}
        />
        <ListItem
          title={'Sermons'}
          position={['last']}
          leftImage={'cross-outline'}
          leftImageType={'material-community'}
          onPress={() => navigation.navigate('AdminSermons')}
        />
        <Divider />
        <ListItem
          title={'Content'}
          position={['first', 'last']}
          leftImage={'card-multiple-outline'}
          leftImageType={'material-community'}
          onPress={() => navigation.navigate('AdminContent')}
        />
        <Divider />
        <ListItem
          title={'Push Notifications'}
          position={['first', 'last']}
          leftImage={'bell-outline'}
          leftImageType={'material-community'}
          onPress={() => navigation.navigate('AdminNotifications')}
        />
        <Divider />
        <ListItem
          title={'Users'}
          position={['first', 'last']}
          leftImage={'account-multiple-outline'}
          leftImageType={'material-community'}
          onPress={() => navigation.navigate('AdminUsers')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminHomeScreen;

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
          title={'Pasteurs'}
          position={['first']}
          leftImage={'account-outline'}
          leftImageType={'material-community'}
          onPress={() => navigation.navigate('AdminPasteursList')}
        />
        <ListItem
          title={'Sermons'}
          leftImage={'cross-outline'}
          leftImageType={'material-community'}
          onPress={() => navigation.navigate('AdminSermonsList')}
        />
        <ListItem
          title={'Content'}
          position={['last']}
          leftImage={'file-document-edit-outline'}
          leftImageType={'material-community'}
          // onPress={() => navigation.navigate('')}
        />
        <Divider />
        <ListItem
          title={'Push Notifications'}
          position={['first', 'last']}
          leftImage={'bell-outline'}
          leftImageType={'material-community'}
          // onPress={() => navigation.navigate('')}
        />
        <Divider />
        <ListItem
          title={'Users'}
          position={['first', 'last']}
          leftImage={'account-multiple-outline'}
          leftImageType={'material-community'}
          onPress={() => navigation.navigate('AdminUsersList')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminHomeScreen;

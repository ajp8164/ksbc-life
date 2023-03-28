import { Divider, ListItem } from '@react-native-ajp-elements/ui';

import { MoreNavigatorParamList } from 'types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PageContentItemAssignment } from 'types/pageContentItem';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { useTheme } from 'theme';

type Props = NativeStackScreenProps<MoreNavigatorParamList, 'AdminPageContent'>;

const AdminContentScreen = ({ navigation }: Props) => {
  const theme = useTheme();

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Divider text={'PAGES'} />
        <ListItem
          title={'Ministries'}
          position={['first']}
          leftImage={'handshake-outline'}
          leftImageType={'material-community'}
          onPress={() =>
            navigation.navigate('AdminPageContent', {
              pageName: PageContentItemAssignment.Ministries,
            })
          }
        />
        <ListItem
          title={'Sermons'}
          leftImage={'television-play'}
          leftImageType={'material-community'}
          onPress={() =>
            navigation.navigate('AdminPageContent', {
              pageName: PageContentItemAssignment.Sermons,
            })
          }
        />
        <ListItem
          title={'Giving'}
          position={['last']}
          leftImage={'heart-circle'}
          leftImageType={'material-community'}
          onPress={() =>
            navigation.navigate('AdminPageContent', {
              pageName: PageContentItemAssignment.Giving,
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminContentScreen;

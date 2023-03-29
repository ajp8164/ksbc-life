import { AppTheme, useTheme } from 'theme';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';

import { ChatNavigatorParamList } from 'types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { makeStyles } from '@rneui/themed';

export type Props = NativeStackScreenProps<
  ChatNavigatorParamList,
  'ChatThreadList'
>;

const ChatThreadListScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Divider />
        <ListItem
          title={'Andy'}
          position={['first']}
          onPress={() =>
            navigation.navigate('ChatThread', {
              threadId: 'andy',
            })
          }
        />
        <ListItem
          title={'Andy'}
          position={['last']}
          onPress={() =>
            navigation.navigate('ChatThread', {
              threadId: 'andy',
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({}));

export default ChatThreadListScreen;

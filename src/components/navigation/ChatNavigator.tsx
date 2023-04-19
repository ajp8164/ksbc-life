import ChatGroupListScreen from 'components/ChatGroupListScreen';
import ChatGroupScreen from 'components/ChatGroupScreen';
import { ChatNavigatorParamList } from 'types/navigation';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'theme';

const ChatStack = createNativeStackNavigator<ChatNavigatorParamList>();

const ChatNavigator = () => {
  const theme = useTheme();

  return (
    <ChatStack.Navigator
      initialRouteName="ChatGroupList"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.screenHeaderBackground,
        },
        headerTitleStyle: {
          color: theme.colors.screenHeaderText,
        },
        headerTintColor: theme.colors.screenHeaderBackButton,
      }}>
      <ChatStack.Screen
        name="ChatGroupList"
        component={ChatGroupListScreen}
        options={{
          title: 'Chat',
          headerLeft: () => null,
          headerLargeTitle: true,
        }}
      />
      <ChatStack.Screen
        name="ChatGroup"
        component={ChatGroupScreen}
        options={{
          title: 'Chat',
        }}
      />
    </ChatStack.Navigator>
  );
};

export default ChatNavigator;

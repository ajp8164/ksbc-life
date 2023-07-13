import ChatGroupsScreen from 'components/ChatGroupsScreen';
import { ChatNavigatorParamList } from 'types/navigation';
import ChatThreadScreen from 'components/ChatThreadScreen';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'theme';

const ChatStack = createNativeStackNavigator<ChatNavigatorParamList>();

const ChatNavigator = () => {
  const theme = useTheme();

  return (
    <ChatStack.Navigator
      initialRouteName="ChatGroups"
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
        name="ChatGroups"
        component={ChatGroupsScreen}
        options={{
          title: 'Chat',
          headerLeft: () => null,
          headerLargeTitle: true,
          headerBackTitle: '',
        }}
      />
      <ChatStack.Screen
        name="ChatThread"
        component={ChatThreadScreen}
        options={{
          title: 'Chat',
        }}
      />
    </ChatStack.Navigator>
  );
};

export default ChatNavigator;

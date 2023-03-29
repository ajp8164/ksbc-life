import { ChatNavigatorParamList } from 'types/navigation';
import ChatScreen from 'components/ChatScreen';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'theme';

const ChatStack = createNativeStackNavigator<ChatNavigatorParamList>();

const ChatNavigator = () => {
  const theme = useTheme();

  return (
    <ChatStack.Navigator
      initialRouteName="Chat"
      screenOptions={{
        headerLargeTitleShadowVisible: theme.mode === 'light',
        headerLargeStyle: {
          backgroundColor: theme.colors.screenHeaderBackground,
        },
        headerStyle: {
          backgroundColor: theme.colors.screenHeaderBackground,
        },
        headerTitleStyle: {
          color: theme.colors.screenHeaderText,
        },
        headerTintColor: theme.colors.screenHeaderBackButton,
      }}>
      <ChatStack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Chat',
          headerLeft: () => null,
          headerLargeTitle: true,
        }}
      />
    </ChatStack.Navigator>
  );
};

export default ChatNavigator;

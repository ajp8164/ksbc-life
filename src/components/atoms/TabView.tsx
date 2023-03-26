/**
 * Typed View for react-native-scrollable-tab-view ScrollableTabView child.
 */
import React, { FC } from 'react';
import { View, ViewProps } from 'react-native';

interface TabProps extends ViewProps {
  tabLabel: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TabView: FC<TabProps> = ({ tabLabel, ...props }) => (
  <View {...props} />
);

import * as React from 'react';

import { Image, StyleSheet, View } from 'react-native';
import { MessageType, Theme } from '../../types';

import { CircularActivityIndicator } from '../CircularActivityIndicator';

export const StatusIcon = React.memo(
  ({
    currentUserIsAuthor,
    status,
    theme,
  }: {
    currentUserIsAuthor: boolean;
    status?: MessageType.Any['status'];
    theme: Theme;
  }) => {
    let statusIcon: React.ReactNode | null = null;

    switch (status) {
      case 'delivered':
      case 'sent':
        statusIcon = theme.icons?.deliveredIcon?.() ?? (
          <Image
            source={require('../../assets/icon-delivered.png')}
            style={theme.statusIcon.image}
            testID="DeliveredIcon"
          />
        );
        break;
      case 'error':
        statusIcon = theme.icons?.errorIcon?.() ?? (
          <Image
            source={require('../../assets/icon-error.png')}
            style={theme.statusIcon.imageError}
            testID="ErrorIcon"
          />
        );
        break;
      case 'seen':
        statusIcon = theme.icons?.seenIcon?.() ?? (
          <Image
            source={require('../../assets/icon-seen.png')}
            style={theme.statusIcon.image}
            testID="SeenIcon"
          />
        );
        break;
      case 'sending':
        statusIcon = theme.icons?.sendingIcon?.() ?? (
          <CircularActivityIndicator
            color={theme.statusIcon.activityIndicator.color}
            size={theme.statusIcon.activityIndicator.size}
          />
        );
        break;
      default:
        break;
    }

    return currentUserIsAuthor ? (
      <View style={styles.container} testID="StatusIconContainer">
        {statusIcon}
      </View>
    ) : null;
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 16,
    justifyContent: 'center',
    paddingHorizontal: 4,
    width: 16,
  },
});

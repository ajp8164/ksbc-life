import { AppTheme, useTheme } from 'theme';
import { useContext, useEffect, useState } from 'react';

import { Incubator } from 'react-native-ui-lib';
import { NetworkContext } from 'lib/network';
import { makeStyles } from '@rneui/themed';

const NetworkConnectionBar = () => {
  const theme = useTheme();
  const s = useStyles(theme);

  const network = useContext(NetworkContext);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!network.state?.isConnected);
  }, [network.state?.isConnected]);

  const onDismiss = () => {
    setVisible(false);
  };

  return (
    <Incubator.Toast
      visible={visible}
      position={'top'}
      zIndex={1}
      elevation={1}
      message={'No internet connection'}
      swipeable={true}
      autoDismiss={5000}
      onDismiss={onDismiss}
      messageStyle={s.message}
      style={s.bar}
      centerMessage={true}
    />
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  bar: {
    backgroundColor: theme.colors.darkGray,
    opacity: 0.7,
  },
  message: {
    ...theme.styles.textNormal,
    color: theme.colors.white,
  },
}));

export default NetworkConnectionBar;

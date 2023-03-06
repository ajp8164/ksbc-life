import { AppTheme, useTheme } from 'theme';
import { Text, View } from 'react-native';

import { makeStyles } from '@rneui/themed';

interface ModalHeaderInterface {
  title: string;
}

const ModalHeader = ({ title }: ModalHeaderInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <View style={s.view}>
      <Text style={s.title}>{title}</Text>
    </View>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  view: {
    paddingHorizontal: 15,
  },
  title: {
    ...theme.styles.textHeading1,
    fontSize: 34.5,
    letterSpacing: -1.7,
    marginTop: 30,
  },
}));

export default ModalHeader;

import { AppTheme, useTheme } from 'theme';
import { Text, View } from 'react-native';

import { Icon } from '@rneui/base';
import { makeStyles } from '@rneui/themed';

interface NoItemsInterface {
  title?: string;
}

const NoItems = ({ title }: NoItemsInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <View style={[s.noItems]}>
      <Icon
        name={'emoticon-sad-outline'}
        type={'material-community'}
        color={theme.colors.brandSecondary}
        size={48}
      />
      <Text style={theme.styles.textNormal}>{title}</Text>
    </View>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  noItems: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default NoItems;

import { ActivityIndicator, Text, View } from 'react-native';
import { AppTheme, useTheme } from 'theme';

import { Icon } from '@rneui/base';
import { makeStyles } from '@rneui/themed';

interface NoItemsInterface {
  isLoading?: boolean;
  title?: string;
}

const NoItems = ({ isLoading, title }: NoItemsInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <View style={[s.noItems]}>
      {isLoading ? (
        <ActivityIndicator size={'large'} color={theme.colors.brandPrimary} />
      ) : (
        <Icon
          name={'emoticon-sad-outline'}
          type={'material-community'}
          color={theme.colors.brandSecondary}
          size={48}
        />
      )}
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

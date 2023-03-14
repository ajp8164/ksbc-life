import { AppTheme, useTheme } from 'theme';
import { PasteurViewMethods, PasteurViewProps } from './types';
import { ScrollView, Text } from 'react-native';

import { Image } from '@rneui/base';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeStyles } from '@rneui/themed';

type PasteurView = PasteurViewMethods;

const PasteurView = React.forwardRef<PasteurView, PasteurViewProps>(
  (props, _ref) => {
    const { pasteur } = props;
    const theme = useTheme();
    const s = useStyles(theme);

    return (
      <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 15 }}
          contentInsetAdjustmentBehavior={'automatic'}>
          <Text
            style={s.text}>{`${pasteur.firstName} ${pasteur.lastName}`}</Text>
          <Text style={s.text}>{pasteur.title}</Text>
          <Text style={s.text}>{pasteur.email}</Text>
          <Text style={s.text}>{pasteur.phone}</Text>
          <Text style={s.bioText}>{pasteur.biography}</Text>
          <Image
            source={{ uri: pasteur.photoUrl }}
            containerStyle={{ width: 100, height: 100 }}
          />
        </ScrollView>
      </SafeAreaView>
    );
  },
);

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  text: {
    ...theme.styles.textNormal,
    textAlign: 'center',
  },
  bioText: {
    ...theme.styles.textNormal,
  },
}));

export default PasteurView;

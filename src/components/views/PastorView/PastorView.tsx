import { AppTheme, useTheme } from 'theme';
import { PastorViewMethods, PastorViewProps } from './types';
import { ScrollView, Text } from 'react-native';

import { Image } from '@rneui/base';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeStyles } from '@rneui/themed';

type PastorView = PastorViewMethods;

const PastorView = React.forwardRef<PastorView, PastorViewProps>(
  (props, _ref) => {
    const { pastor } = props;
    const theme = useTheme();
    const s = useStyles(theme);

    return (
      <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 15 }}
          contentInsetAdjustmentBehavior={'automatic'}>
          <Text
            style={s.text}>{`${pastor.firstName} ${pastor.lastName}`}</Text>
          <Text style={s.text}>{pastor.title}</Text>
          <Text style={s.text}>{pastor.email}</Text>
          <Text style={s.text}>{pastor.phone}</Text>
          <Text style={s.bioText}>{pastor.biography}</Text>
          <Image
            source={{ uri: pastor.photoUrl }}
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

export default PastorView;

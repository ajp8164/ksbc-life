import { AppTheme, useTheme } from 'theme';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import React, { useEffect, useRef } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { SermonsNavigatorParamList } from 'types/navigation';
import { TextModal } from 'components/modals/TextModal';
import { makeStyles } from '@rneui/themed';

export type Props = NativeStackScreenProps<
  SermonsNavigatorParamList,
  'SermonDetail'
>;

const SermonDetailScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  console.log(route.params.id);
  const textModalRef = useRef<TextModal>(null);

  useEffect(() => {
    navigation.setOptions({
      title: 'Be Patient',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Divider />
        <ListItem
          title={'Notes'}
          position={['first', 'last']}
          onPress={() => textModalRef.current?.present()}
        />
      </ScrollView>
      <TextModal ref={textModalRef} placeholder={'Type your notes here'} />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  text: {},
}));

export default SermonDetailScreen;

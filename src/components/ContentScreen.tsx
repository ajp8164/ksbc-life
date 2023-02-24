import { AppTheme, useTheme } from 'theme';
import {
  ContentView,
  Divider,
  ListItemAccordian,
} from '@react-native-ajp-elements/ui';
import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';

import { AccountNavigatorParamList } from 'types/navigation';
import { ContentContainer } from 'types/content';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { makeStyles } from '@rneui/themed';

export type Props = NativeStackScreenProps<
  AccountNavigatorParamList,
  'Content'
>;

const ContentScreen = ({ route, navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const contentView = route.params.content;

  useEffect(() => {
    navigation.setOptions({
      title: contentView.name || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = (section: ContentContainer) => {
    if (section.items) {
      return (
        <View style={s.content}>
          <ContentView items={section.items} />
        </View>
      );
    } else {
      return <></>;
    }
  };

  return (
    <View style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        {contentView.lists.map((list, listIndex) => {
          return (
            <View key={listIndex}>
              {list.map((section, index: number, arr: ContentContainer[]) => {
                return (
                  <View key={listIndex * 100 + index}>
                    {index === 0 && <Divider />}
                    <ListItemAccordian
                      title={section.title}
                      position={[
                        index === 0 ? 'first' : undefined,
                        index === arr.length - 1 ? 'last' : undefined,
                      ]}>
                      {renderContent(section)}
                    </ListItemAccordian>
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  content: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
}));

export default ContentScreen;

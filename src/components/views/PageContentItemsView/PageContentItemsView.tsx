import { AppTheme, useTheme } from 'theme';
import {
  PageContentItemsViewMethods,
  PageContentItemsViewProps,
} from './types';
import React, { useImperativeHandle } from 'react';

import Card from 'components/molecules/Card';
import { DateTime } from 'luxon';
import { PageContentItem } from 'types/pageContentItem';
import { makeStyles } from '@rneui/themed';

type PageContentItemsView = PageContentItemsViewMethods;

const PageContentItemsView = React.forwardRef<
  PageContentItemsView,
  PageContentItemsViewProps
>((props, ref) => {
  const { items } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
  }));

  const showCard = (item: PageContentItem) => {
    const today = DateTime.now();
    const startDate = DateTime.fromISO(item.schedule.startDate);
    const endDate =
      item.schedule.endDate.length > 0 &&
      DateTime.fromISO(item.schedule.endDate);
    return (
      item.schedule.enabled &&
      startDate.startOf('day') <= today.startOf('day') &&
      (endDate ? endDate.startOf('day') >= today.startOf('day') : true)
    );
  };

  return (
    <>
      {items.map((i, index) => {
        if (!showCard(i)) return null;
        return (
          <Card
            key={index}
            title={i.content.title}
            body={i.content.body}
            header={i.content.header}
            footer={i.content.footer}
            imageSource={
              i.content.imageUrl?.length > 0
                ? { uri: i.content.imageUrl }
                : undefined
            }
            imageHeight={Number(i.content.imageSize)}
            cardStyle={theme.styles.pageContentCardStyle}
            titleStyle={theme.styles.pageContentCardTitleStyle}
          />
        );
      })}
    </>
  );
});

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...theme.styles.viewHorizontalInset,
  },
  transparentCard: {
    backgroundColor: theme.colors.transparent,
    ...theme.styles.viewHorizontalInset,
  },
  lightCard: {
    backgroundColor: theme.colors.stickyWhite,
    ...theme.styles.viewHorizontalInset,
  },
}));

export default PageContentItemsView;

// <Card
//   title={'Welcome'}
//   body={'Worship 11:00 am\nLife Groups 9:30 am'}
//   imageSource={require('img/ksbc-front.jpg')}
//   imageHeight={300}
//   cardStyle={theme.styles.viewHorizontalInset}
// />
// <Card
//   title={'Daily Devotion'}
//   body={
//     'For God loved the world in this way: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.'
//   }
//   footer={'John 3:16 CSB'}
//   buttons={[
//     {
//       label: 'Share',
//       icon: 'share-variant',
//       onPress: () => {
//         openShareSheet({
//           title: 'John 3:16 CSB',
//           message:
//             'For God loved the world in this way: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.',
//         });
//       },
//     },
//     {
//       label: 'Read',
//       icon: 'book-open-variant',
//       onPress: () => {
//         openURL('https://www.bible.com/bible/1713/JHN.3.CSB');
//       },
//     },
//   ]}
//   cardStyle={s.transparentCard}
//   titleStyle={{ textAlign: 'left' }}
// />
// <View style={s.cardRow}>
//   <Card
//     imageSource={require('img/life-kids.jpg')}
//     flexBasis={viewport.width / 2 - 23}
//     cardStyle={s.lightCard}
//   />
//   <Card
//     imageSource={require('img/life-kids.jpg')}
//     flexBasis={viewport.width / 2 - 23}
//     cardStyle={s.lightCard}
//   />
// </View>
// <Card
//   imageSource={require('img/life-kids.jpg')}
//   cardStyle={s.lightCard}
// />

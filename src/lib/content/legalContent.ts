import { ContentView } from 'types/content';
import ca from './ca';
import privacy from './privacy';
import terms from './terms';

export default <ContentView>{
  name: 'Legal',
  lists: [
    [
      { title: 'Privacy Policy', items: privacy },
      { title: 'Service Agreement', items: terms },
      { title: 'California Privacy Rights', items: ca },
    ],
  ],
};

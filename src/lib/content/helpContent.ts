import { ContentView } from 'types/content';
import faq from './faq';
import features from './features';
import support from './support';

export default <ContentView>{
  name: 'Help',
  lists: [
    [
      { title: 'Features', items: features },
      { title: 'FAQ', items: faq },
    ],
    [{ title: 'Support', items: support }],
  ],
};

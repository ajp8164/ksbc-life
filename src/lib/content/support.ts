import { appConfig } from 'config';
import { ContentItem } from 'types/content';

const { appName, supportUrl } = appConfig;

export default <ContentItem[]>[
  {
    title: '',
    link: {
      prefix: `For help with payments or using this app please visit the ${appName} `,
      text: 'Support Center',
      url: supportUrl,
      suffix: '.',
    },
  },
];

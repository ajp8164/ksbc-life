import { ISODateString } from 'types/common';
import { YouTubeVideo } from 'types/youTube';
import { addSermonVideos } from 'firebase/firestore/sermonVideos';
import { appConfig } from 'config';
import { log } from '@react-native-ajp-elements/core';

const pageSize = 10;

export const cacheYouTubeBroadcastVideosToFirestore = async () => {
  const videosPaginationInfo = await getYouTubeBroadcastVideos();
  const videos = ([] as YouTubeVideo[]).concat(videosPaginationInfo.items);
  addSermonVideos(videos);
};

const getYouTubeBroadcastVideos = async (args?: {
  pageToken?: string;
  publishedAfter?: ISODateString;
  publishedBefore?: ISODateString;
}): Promise<GoogleApiYouTubePaginationInfo<GoogleApiYouTubeSearchResource>> => {
  //////////
  return testData();
  //////////

  const url = 'GET /search';
  try {
    const response = await fetch(
      `${appConfig.youTubeApiUrl}/search` +
        '?part=snippet%2Cid' +
        '&order=date' +
        `&maxResults=${pageSize}` +
        (args?.pageToken ? `&pageToken=${args?.pageToken}` : '') +
        (args?.publishedAfter
          ? `&publishedAfter=${args?.publishedAfter}`
          : '') +
        (args?.publishedBefore
          ? `&publishedBefore=${args?.publishedBefore}`
          : '') +
        `&channelId=${appConfig.youTubeChannelId}` +
        '&type=video' +
        '&eventType=completed' +
        `&key=${appConfig.youTubeApiKey}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    const json = await response.json();
    return json as GoogleApiYouTubePaginationInfo<GoogleApiYouTubeSearchResource>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const msg = `YouTube API (${url}): ${e.message || e}`;
    log.error(msg);
    throw new Error(msg);
  }
};

const testData =
  (): GoogleApiYouTubePaginationInfo<GoogleApiYouTubeSearchResource> => {
    return {
      kind: 'youtube#searchListResponse',
      etag: 'htM5sB6bKuPquI1ogW02oJQDp-U',
      nextPageToken: 'CBQQAA',
      prevPageToken: '',
      // regionCode: 'US',
      pageInfo: {
        totalResults: 162,
        resultsPerPage: 20,
      },
      items: [
        {
          kind: 'youtube#searchResult',
          etag: '_Zg02B5G64AtriXoYz-OED9FkgE',
          id: {
            kind: 'youtube#video',
            videoId: 'n_6MxqxgsBw',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2023-02-27T05:18:47Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'February 26th Live Stream Service',
            description:
              'Join us for the February 26th Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/n_6MxqxgsBw/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/n_6MxqxgsBw/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/n_6MxqxgsBw/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2023-02-27T05:18:47Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'la8qTGt7b-QEtMjhG_1WXl13THc',
          id: {
            kind: 'youtube#video',
            videoId: 'fJF1yFxggoM',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2023-02-20T05:37:18Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'February 19th Live Stream Service',
            description:
              'Join us for the February 19th Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/fJF1yFxggoM/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/fJF1yFxggoM/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/fJF1yFxggoM/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2023-02-20T05:37:18Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'k6MVeedgCf4AKMvTwOeuVC4O8qc',
          id: {
            kind: 'youtube#video',
            videoId: 'K3L7JM44JIA',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2023-02-13T05:35:05Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'February 12th Live Stream Service',
            description:
              'Join us for the February 12th Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/K3L7JM44JIA/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/K3L7JM44JIA/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/K3L7JM44JIA/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2023-02-13T05:35:05Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'szFSDeT2l94hAzl8UGmSjWbp2AI',
          id: {
            kind: 'youtube#video',
            videoId: 'OLxXFQgcyNM',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2023-02-06T05:20:43Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'February 5th Live Stream Service',
            description:
              'Join us for the February 5th Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/OLxXFQgcyNM/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/OLxXFQgcyNM/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/OLxXFQgcyNM/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2023-02-06T05:20:43Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'OW5LVOFP7TiFs0QxKoZPGMJD8Xg',
          id: {
            kind: 'youtube#video',
            videoId: 'uIbeFYCEGlo',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2023-01-30T05:51:01Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'January 29th Live Stream Service',
            description:
              'Join us for the January 29th Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/uIbeFYCEGlo/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/uIbeFYCEGlo/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/uIbeFYCEGlo/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2023-01-30T05:51:01Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'mOZot9wMc5w6YgGyJX3L6zHXAHA',
          id: {
            kind: 'youtube#video',
            videoId: '0eNzv4kYXMo',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2023-01-23T06:26:52Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'January 22nd Live Stream Service',
            description:
              'Join us for the January 22nd Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/0eNzv4kYXMo/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/0eNzv4kYXMo/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/0eNzv4kYXMo/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2023-01-23T06:26:52Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: '8dVlPCQHZeWO6yVOSNZ4k5prsrM',
          id: {
            kind: 'youtube#video',
            videoId: 'qb8TDlU4GfA',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2023-01-16T05:22:11Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'Jan 15th Live Stream Service',
            description:
              'Join us for the Jan 15th Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/qb8TDlU4GfA/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/qb8TDlU4GfA/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/qb8TDlU4GfA/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2023-01-16T05:22:11Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'o9_uTkCrsDa2cHGBG3L3YUzEir4',
          id: {
            kind: 'youtube#video',
            videoId: 'E6RqVtEROVo',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2023-01-09T05:34:17Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'Jan 8th Live Stream Service',
            description:
              'Join us for the Jan 8th Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/E6RqVtEROVo/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/E6RqVtEROVo/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/E6RqVtEROVo/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2023-01-09T05:34:17Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: '1ijyObS7lDYLHYWzxro8oMNBDgA',
          id: {
            kind: 'youtube#video',
            videoId: 'QxaOZxp4uLs',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2023-01-02T05:18:22Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'Jan 1st Live Stream Service',
            description:
              'Join us for the Jan 1st Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/QxaOZxp4uLs/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/QxaOZxp4uLs/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/QxaOZxp4uLs/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2023-01-02T05:18:22Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'cduB7gUPwTW31P7YTKjFb-QljO0',
          id: {
            kind: 'youtube#video',
            videoId: 'szzyvB55Z2M',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2022-12-26T05:06:06Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'Christmas Day Live Stream Service',
            description:
              'Join us for the Christmas Day Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/szzyvB55Z2M/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/szzyvB55Z2M/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/szzyvB55Z2M/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2022-12-26T05:06:06Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'wmfk2TTA2UgS7Pb5KryPhv0WPwM',
          id: {
            kind: 'youtube#video',
            videoId: 'QZEBDnrrC9g',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2022-12-25T11:44:30Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'Christmas Eve Live Stream Service',
            description:
              'Join us for the Christmas Eve Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/QZEBDnrrC9g/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/QZEBDnrrC9g/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/QZEBDnrrC9g/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2022-12-25T11:44:30Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'C2wpFTpvIyiGWsLzOUGDn5368jM',
          id: {
            kind: 'youtube#video',
            videoId: 'MNHqEPuOK34',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2022-12-19T05:11:57Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'December 18th Live Stream Service',
            description:
              'Join us for the December 18th Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/MNHqEPuOK34/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/MNHqEPuOK34/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/MNHqEPuOK34/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2022-12-19T05:11:57Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'wnhrg01peIkCwpxiJHYO284GAnU',
          id: {
            kind: 'youtube#video',
            videoId: 'NzYZGxc9sOY',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2022-12-12T05:29:33Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'December 11th Live Stream Service',
            description:
              'Join us for the December 9th Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/NzYZGxc9sOY/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/NzYZGxc9sOY/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/NzYZGxc9sOY/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2022-12-12T05:29:33Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'xZ6Vj2Ok_f88KBhV4qouUExksck',
          id: {
            kind: 'youtube#video',
            videoId: 'IQrtFztMMSo',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2022-12-05T05:22:54Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'December 4th Live Stream Service',
            description:
              'Join us for the December 4th Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/IQrtFztMMSo/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/IQrtFztMMSo/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/IQrtFztMMSo/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2022-12-05T05:22:54Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'o0UPWp3XIm6CCHu7qZw6hDArie8',
          id: {
            kind: 'youtube#video',
            videoId: 'cIJheWxNLYg',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2022-11-28T05:17:54Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'November 27th Live Stream Service',
            description:
              'Join us for the November 27th Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/cIJheWxNLYg/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/cIJheWxNLYg/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/cIJheWxNLYg/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2022-11-28T05:17:54Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'bdjIhHQH1ZqLzP5zas5aS2-s8tM',
          id: {
            kind: 'youtube#video',
            videoId: '7NEGDKIilh8',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2022-11-21T05:22:46Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'November 20th Live Stream Service',
            description:
              'Join us for the November 20th Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/7NEGDKIilh8/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/7NEGDKIilh8/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/7NEGDKIilh8/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2022-11-21T05:22:46Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'RjRdLxOChE4Cty2Pv9nxgWT-1U4',
          id: {
            kind: 'youtube#video',
            videoId: '0bOsmaK5NwQ',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2022-11-14T05:23:09Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'November 13th Live Stream Service',
            description:
              'Join us for the November 13th Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/0bOsmaK5NwQ/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/0bOsmaK5NwQ/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/0bOsmaK5NwQ/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2022-11-14T05:23:09Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: '3_PZjxDz2dEqTj4GNlRw9UG34KQ',
          id: {
            kind: 'youtube#video',
            videoId: 'oNBDiAQR3jo',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2022-11-07T05:20:54Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'November 6th Live Stream Service',
            description:
              'Join us for the November 6th Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/oNBDiAQR3jo/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/oNBDiAQR3jo/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/oNBDiAQR3jo/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2022-11-07T05:20:54Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'x-9iFjloc0ZKzosk6Vmo-0fA7Ns',
          id: {
            kind: 'youtube#video',
            videoId: 'oM_l-EuhhVM',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2022-10-31T04:27:55Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'October 30th Live Stream Service',
            description:
              'Join us for the October 30th Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/oM_l-EuhhVM/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/oM_l-EuhhVM/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/oM_l-EuhhVM/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2022-10-31T04:27:55Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'Skv2qBI7fFrkEc4lU_bL5cBqGN8',
          id: {
            kind: 'youtube#video',
            videoId: '93jQCBv_kgE',
            channelId: '',
            playlistId: '',
          },
          snippet: {
            publishedAt: '2022-10-24T04:28:59Z',
            channelId: 'UC5pC3i8JMswGI7S0LJlNs1Q',
            title: 'October 23rd Live Stream Service',
            description:
              'Join us for the October 23rd Service, live! Remember to like us on Facebook KingSpringBC and follow us on YouTube at ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/93jQCBv_kgE/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/93jQCBv_kgE/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/93jQCBv_kgE/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'King Spring Church',
            // liveBroadcastContent: 'none',
            // publishTime: '2022-10-24T04:28:59Z',
          },
        },
      ],
    };
  };

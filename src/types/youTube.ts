export type YouTubeVideo = GoogleApiYouTubeSearchResource;

export type YouTubeVideoId = {
  id?: string;
  kind: string;
  videoId: string;
  channelId: string;
  playlistId: string;
};

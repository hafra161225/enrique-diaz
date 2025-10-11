export interface PodcastSeries {
  id: string;
  title: string;
  description: string;
  imageUrl: any; // Can be require() result or string URL
  totalEpisodes: number;
  displayedEpisodes: number;
  moreEpisodesUrl: string;
  language: string; // Language code (es, sv, en)
  category?: string;
}

export interface PodcastEpisode {
  id: string;
  seriesId: string;
  title: string;
  description: string;
  audioUrl: string; // URL to audio file or Spotify preview
  imageUrl: string; // Cover image URL
  duration: number; // Duration in seconds
  publishedAt: string;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  error?: string;
  mode: 'audio' | 'demo' | 'spotify';
}
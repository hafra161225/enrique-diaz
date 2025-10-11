// src/app/services/podcast.service.ts
import { Injectable } from '@angular/core';
import { PodcastSeries, PodcastEpisode } from '../interfaces/podcast';

@Injectable({
  providedIn: 'root'
})
export class PodcastsService {
  podcastMetadata = {
    lastUpdated: Date.now(),
    episodeCounts: {
      'hombres-valientes': { total: 62, displayed: 3, latest: [62, 61, 60] },
      'man-i-fokus': { total: 64, displayed: 3, latest: [64, 63, 62] },
      'frid-med-gud': { total: 25, displayed: 3, latest: [25, 24, 23] }
    }
  };

  podcastSeries: PodcastSeries[] = [
    {
      id: 'hombres-valientes',
      title: 'Hombres valientes',
      description: 'Un podcast que te ayudará a desarrollar la mentalidad, herramientas y estrategias...',
      imageUrl: 'assets/images/man-i-fokus.jpg',
      totalEpisodes: this.podcastMetadata.episodeCounts['hombres-valientes'].total,
      displayedEpisodes: this.podcastMetadata.episodeCounts['hombres-valientes'].displayed,
      moreEpisodesUrl: 'https://open.spotify.com/show/7awdaEr1ovXnQu4qFqxo4P',
      language: 'es'
    },
    {
      id: 'man-i-fokus',
      title: 'Män i fokus!',
      description: 'En podcast som hjälper dig att utveckla tankesättet...',
      imageUrl: 'assets/images/man-i-fokus.jpg',
      totalEpisodes: this.podcastMetadata.episodeCounts['man-i-fokus'].total,
      displayedEpisodes: this.podcastMetadata.episodeCounts['man-i-fokus'].displayed,
      moreEpisodesUrl: 'https://open.spotify.com/show/6QEtTzOqllO2eQrKO07s6I',
      language: 'sv'
    },
    {
      id: 'frid-med-gud',
      title: 'Frid med Gud!',
      description: 'En kristen podcast som utforskar tro, hopp och kärlek...',
      imageUrl: 'assets/images/frid-med-gud.jpg',
      totalEpisodes: this.podcastMetadata.episodeCounts['frid-med-gud'].total,
      displayedEpisodes: this.podcastMetadata.episodeCounts['frid-med-gud'].displayed,
      moreEpisodesUrl: 'https://open.spotify.com/show/09jMerowSyLPpy8Q10rD67',
      language: 'sv'
    }
  ];

  podcastEpisodes: PodcastEpisode[] = [
    {
      id: 'hombres-valientes_62',
      seriesId: 'hombres-valientes',
      title: '62. La ciencia y tus metas!',
      description: 'Después de tanta ciencia...',
      audioUrl: 'https://open.spotify.com/episode/0ZvTKsMmhZOuBU912DflqV',
      imageUrl: 'https://i.scdn.co/image/ab67656300005f1fc95f27af6bd2a306149a5a65',
      duration: 840,
      publishedAt: new Date().toISOString()
    },
    // ...add the rest here like your original code
  ];

  shouldUpdatePodcasts(): boolean {
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    return Date.now() - this.podcastMetadata.lastUpdated > TWENTY_FOUR_HOURS;
  }

  updatePodcastEpisodes(newEpisodes: { [seriesId: string]: PodcastEpisode[] }) {
    const updatedEpisodes: PodcastEpisode[] = [];

    for (const [seriesId, episodes] of Object.entries(newEpisodes)) {
      updatedEpisodes.push(...episodes);
      const episodeNumbers = episodes.map(ep => {
        const match = ep.title.match(/(\d+)\./);
        return match ? parseInt(match[1]) : 0;
      }).sort((a, b) => b - a);

      if (this.podcastMetadata.episodeCounts[seriesId as keyof typeof this.podcastMetadata.episodeCounts]) {
        this.podcastMetadata.episodeCounts[seriesId as keyof typeof this.podcastMetadata.episodeCounts].latest = episodeNumbers;
      }
    }

    this.podcastEpisodes = updatedEpisodes;
    this.podcastMetadata.lastUpdated = Date.now();
    console.log('Podcast episodes updated with latest from Spotify');
  }

  getEpisodesBySeriesId(seriesId: string): PodcastEpisode[] {
    return this.podcastEpisodes.filter(episode => episode.seriesId === seriesId);
  }

  getEpisodeById(episodeId: string): PodcastEpisode | undefined {
    return this.podcastEpisodes.find(episode => episode.id === episodeId);
  }

  getSeriesById(seriesId: string): PodcastSeries | undefined {
    return this.podcastSeries.find(series => series.id === seriesId);
  }
}

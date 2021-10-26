export interface AnimeTitle {
  romaji: string;
  english: string;
  native: string;
  user_preferred: string;
}

export interface AnimeCoverImage {
  extra_large: string;
  large: string;
  medium: string;
  color: string;
}

export interface CharacterImage {
  large: string;
  medium: string;
}

export interface Character {
  role: string;
  name: string;
  image: CharacterImage;
}

export interface Recommendation {
  anime: Anime;
}

export interface AiringSchedule {
  airing_at: number;
  episode: number;
}

export interface Episode {
  name: string;
  episode_id: string;
  source_id: string;
  source: string;
}

export interface RelationAnime {
  relation_type: string;
  anime: Anime;
}

export interface Anime {
  title: AnimeTitle;
  cover_image: AnimeCoverImage;
  start_date: number;
  trending: number;
  popularity: number;
  favourites: number;
  banner_image?: string;
  season: string;
  season_year: number;
  format: string;
  status: string;
  duration: number;
  genres: string[];
  is_adult: boolean;
  country_of_origin: string;
  average_score: number;
  studios: string[];
  characters: Character[];
  relations: RelationAnime[];
  recommendations: Recommendation[];
  airing_schedule: AiringSchedule[];
  total_episodes?: number;
  ani_id: number;
  description: string;
  episodes: Episode[];
  source_d: string;
}

import { QueryKey } from "react-query";
import { SkeletonProps } from "./components/shared/Skeleton";
import {
  CHARACTERS_ROLES,
  FORMATS,
  GENRES,
  SEASONS,
  STATUSES,
} from "./constants";
import {
  SupabaseQueryFunction,
  UseSupabaseQueryOptions,
} from "./utils/supabase";

export interface Title {
  romaji: string;
  english: string;
  native: string;
  user_preferred: string;
}

export interface CoverImage {
  extra_large: string;
  large: string;
  medium: string;
  color: string;
}

export interface CharacterImage {
  large: string;
  medium: string;
}

export type CharacterRole = typeof CHARACTERS_ROLES[number];
export interface Character {
  role: CharacterRole;
  name: string;
  image: CharacterImage;
}

export interface AnimeRecommendation {
  anime: Anime;
}

export interface MangaRecommendation {
  manga: Manga;
}
export interface AiringSchedule {
  airing_at: number;
  episode: number;
}

export interface Episode {
  name: string;
  episode_id: number;
  source_id: number;
  thumbnail_image?: string;
  anime_id: number;
}

export interface Chapter {
  name: string;
  chapter_id: number;
  source_id: number;
  manga_id: number;
}

export interface AnimeRelation {
  anime: Anime;
}

export interface MangaRelation {
  manga: Manga;
}

export type Season = typeof SEASONS[number];
export type Format = typeof FORMATS[number];
export type Status = typeof STATUSES[number];
export type Genre = typeof GENRES[number]["value"];

export interface Anime {
  title: Title;
  cover_image: CoverImage;
  start_date?: number;
  trending?: number;
  popularity?: number;
  favourites?: number;
  banner_image?: string;
  season?: Season;
  season_year?: number;
  format?: Format;
  status?: Status;
  duration?: number;
  genres?: Genre[];
  is_adult?: boolean;
  country_of_origin?: string;
  average_score?: number;
  studios?: string[];
  characters?: Character[];
  relations?: AnimeRelation[];
  recommendations?: AnimeRecommendation[];
  airing_schedule?: AiringSchedule[];
  total_episodes?: number;
  ani_id?: number;
  description?: string;
  episodes?: Episode[];
  source_id?: number;
  created_at?: Date;
  updated_at?: Date;
  episodes_updated_at?: Date;
  tags?: string[];
}

export interface Manga {
  title: string | Title;
  cover_image: CoverImage;
  start_date?: number;
  trending?: number;
  popularity?: number;
  favourites?: number;
  banner_image?: string;
  season?: Season;
  season_year?: number;
  format?: Format;
  status?: Status;
  genres?: Genre[];
  is_adult?: boolean;
  country_of_origin?: string;
  average_score?: number;
  studios?: string[];
  characters?: Character[];
  relations?: MangaRelation[];
  recommendations?: MangaRecommendation[];
  ani_id?: number;
  description?: string;
  source_id?: number;
  created_at?: Date;
  updated_at?: Date;
  tags?: string[];
  slug?: string;
  chapters: Chapter[];
}

export interface Section<T> {
  title: string;
  query?: {
    key: QueryKey;
    queryFn: SupabaseQueryFunction<T>;
    options?: UseSupabaseQueryOptions<T>;
  };
  skeleton: React.ComponentType<SkeletonProps>;
  render: (data: T[]) => React.ReactNode;
  clientData?: () => void;
}

export interface Watched {
  anime: Anime;
  episode: Episode;
  user_id: string;
  updated_at?: Date;
  created_at?: Date;
}

export interface Read {
  manga: Manga;
  chapter: Chapter;
  user_id: string;
  updated_at?: Date;
  created_at?: Date;
}

export type CallbackSetter<T> = (handler: T) => void;

export type Noop = () => void;

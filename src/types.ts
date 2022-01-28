import { SkeletonProps } from "@/components/shared/Skeleton";
import {
  CHARACTERS_ROLES,
  FORMATS,
  GENRES,
  READ_STATUS,
  SEASONS,
  STATUS,
  WATCH_STATUS,
} from "@/constants";
import { SupabaseQueryFunction, SupabaseQueryOptions } from "@/utils/supabase";
import { User } from "@supabase/gotrue-js";
import { QueryKey } from "react-query";

export interface FuzzyDate {
  day?: number;
  month?: number;
  year?: number;
}
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

export type CharacterConnection<T> = (T extends "anime"
  ? {
      anime_id?: number;
      anime?: Anime;
    }
  : {
      manga_id: number;
      manga?: Manga;
    }) & {
  character_id?: number;
  character: Character;
  role: CharacterRole;
};

export interface Character {
  id: number;
  gender?: string;
  dateOfBirth?: FuzzyDate;
  name: string;
  image: CharacterImage;
  age?: string;
  favourites?: number;
  updated_at?: Date;
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
  anime_id: number;
  anime?: Anime;
}

export interface Episode {
  name?: string;
  episode_id?: number;
  source_id?: number;
  thumbnail_image?: string;
  anime_id?: number;
  id?: number;
  episodeIndex?: number;
  count?: number;
}

export interface Chapter {
  name?: string;
  chapter_id?: number;
  source_id?: number;
  manga_id?: number;
  id?: number;
  count?: number;
}

export interface AnimeRelation {
  anime: Anime;
}

export interface MangaRelation {
  manga: Manga;
}

export type Season = typeof SEASONS[number]["value"];
export type Format = typeof FORMATS[number]["value"];
export type Status = typeof STATUS[number]["value"];
export type Genre = typeof GENRES[number]["value"];
export type CharacterRole = typeof CHARACTERS_ROLES[number]["value"];

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
  characters?: CharacterConnection<"anime">[];
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
  vietnamese_title?: string;
  synonyms?: string[];
  titles?: string[];
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
  characters?: CharacterConnection<"manga">[];
  relations?: MangaRelation[];
  recommendations?: MangaRecommendation[];
  ani_id?: number;
  description?: string;
  source_id?: number;
  created_at?: Date;
  updated_at?: Date;
  tags?: string[];
  slug?: string;
  chapters?: Chapter[];
  vietnamese_title?: string;
  chapters_updated_at?: Date;
}

export interface Section<T> {
  title: string;
  query?: {
    key: QueryKey;
    queryFn: SupabaseQueryFunction<T>;
    options?: SupabaseQueryOptions<T>;
  };
  skeleton: React.ComponentType<SkeletonProps>;
  render: (data: T[]) => React.ReactNode;
  clientData?: () => void;
}

export interface Watched {
  anime: Anime;
  episode: Episode;
  anime_id?: number;
  episode_id?: number;
  user_id: string;
  updated_at?: Date;
  created_at?: Date;
  watched_time?: number;
}

export interface Read {
  manga: Manga;
  manga_id?: number;
  chapter_id?: number;
  chapter: Chapter;
  user_id: string;
  updated_at?: Date;
  created_at?: Date;
}

export interface Reaction {
  updated_at?: Date;
  created_at?: Date;
  id: number;
  emoji: string;
  user_id?: string;
  user?: User;
  comment_id?: number;
  comment?: Comment;
}
export interface ReplyComment {
  comment: Comment;
}
export interface Comment {
  updated_at?: Date;
  created_at?: Date;
  user_id?: string;
  user?: User;
  anime?: Anime;
  manga?: Manga;
  anime_id?: number;
  manga_id?: number;
  body: string;
  id?: number;
  reply_comments?: ReplyComment[];
  is_reply?: boolean;
  is_edited?: boolean;
  reactions?: Reaction[];
}

export type Source = {
  file: string;
  label: string;
};

export type CallbackSetter<T> = (handler: T) => void;

export type Noop = () => void;

export type WatchStatus = typeof WATCH_STATUS[number]["value"];
export type ReadStatus = typeof READ_STATUS[number]["value"];

export type SourceStatus<T> = (T extends "anime"
  ? {
      status?: WatchStatus;
      anime_id?: number;
      anime?: Anime;
    }
  : {
      status?: ReadStatus;
      anime_id?: number;
      anime?: Manga;
    }) & {
  user_id?: number;
  user?: User;
};

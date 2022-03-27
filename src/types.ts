import { SkeletonProps } from "@/components/shared/Skeleton";
import { GENRES, READ_STATUS, WATCH_STATUS } from "@/constants";
import { SupabaseQueryFunction, SupabaseQueryOptions } from "@/utils/supabase";
import { User } from "@supabase/gotrue-js";
import { QueryKey } from "react-query";
import {
  CharacterRole,
  FuzzyDate,
  MediaFormat,
  MediaRelation,
  MediaStatus,
  MediaTitle,
} from "./anilist";

export type MediaGenre = typeof GENRES[number]["value"];

export type SourceConnection = {
  id: string;
  sourceId: string;
  sourceMediaId: string;
  mediaId: string;
  source: Source;
};

export interface AnimeSourceConnection extends SourceConnection {
  episodes: Episode[];
}

export interface MangaSourceConnection extends SourceConnection {
  chapters: Chapter[];
}

export type Source = {
  id: string;
  name: string;
};

export type Episode = {
  name: string;
  sourceConnectionId?: string;
  sourceConnection?: AnimeSourceConnection;
  sourceId: string;
  sourceEpisodeId: string;
  sourceMediaId: string;
  source: Source;
  slug: string;
  thumbnailImage?: string;
};

export type Chapter = {
  name: string;
  sourceConnectionId?: string;
  sourceConnection?: MangaSourceConnection;
  sourceId: string;
  sourceChapterId: string;
  sourceMediaId: string;
  source: Source;
  slug: string;
};

export type VoiceActorImage = {
  large: string;
  medium: string;
};

export type VoiceActorName = {
  first: string;
  middle: string;
  last: string;
  full: string;
  native: string;
  alternative: string[];
  userPreferred: string;
};

export type VoiceActorConnection = {
  voiceActorId: number;
  characterId: number;
  voiceActor?: VoiceActor;
  character?: Character;
};

export type VoiceActor = {
  id: number;
  name: VoiceActorName;
  language: string;
  image: VoiceActorImage;
  gender: string;
  dateOfBirth: FuzzyDate;
  dateOfDeath: FuzzyDate;
  age: number;
  yearsActive: number[];
  homeTown: string;
  bloodType: string;
  favourites: number;
};

export type AiringSchedule = {
  id: number;
  airingAt: number;
  episode: number;
  mediaId: number;
  media?: Anime;
};

export type Recommendation<T extends Anime | Manga> = {
  media: T;
};

export type Relation<T extends Anime | Manga> = {
  media: T;
  relationType: MediaRelation;
};

export type CharacterImage = {
  large: string;
  medium: string;
};

export type CharacterName = {
  first: string;
  middle: string;
  last: string;
  full: string;
  native: string;
  alternative: string[];
  alternativeSpoiler: string[];
  userPreferred: string;
};

export type CharacterConnection<T extends Anime | Manga> = {
  characterId: number;
  id: number;
  role: CharacterRole;
  name: string;
  mediaId: number;
  media?: T;
  character: Character;
};

export type Character = {
  id: number;
  name: CharacterName;
  image: CharacterImage;
  gender: string;
  dateOfBirth: FuzzyDate;
  age: string;
  favourites: number;
};

export type StudioConnection = {
  studioId: number;
  isMain: boolean;
  id: number;
  mediaId: number;
  studio: Studio;
  media: Anime;
};

export type Studio = {
  id: number;
  name: string;
  isAnimationStudio: boolean;
  favourites: number;
};

export type CoverImage = {
  extraLarge: string;
  large: string;
  medium: string;
  color: string;
};

export interface Media<T extends Anime | Manga> {
  id: number;
  idMal: number;
  title: MediaTitle;
  coverImage: CoverImage;
  startDate: FuzzyDate;
  trending: number;
  popularity: number;
  favourites: number;
  bannerImage: string;
  format: MediaFormat;
  status: MediaStatus;
  characters: CharacterConnection<T>[];
  relations: Relation<T>[];
  recommendations: Recommendation<T>[];
  tags: string[];
  genres: string[];
  countryOfOrigin: string;
  isAdult: boolean;
  synonyms: string[];
  averageScore: number;
  description: string;
  vietnameseTitle?: string;
  updated_at?: string;
  created_at?: string;
}

export interface Anime extends Media<Anime> {
  sourceConnections: AnimeSourceConnection[];
  season: string;
  seasonYear: number;
  totalEpisodes: number;
  studios: StudioConnection[];
  voiceActors: VoiceActorConnection[];
  airingSchedules: AiringSchedule[];
  episodeUpdatedAt: string;
  duration: number;
  trailer?: string;
}

export interface Manga extends Media<Manga> {
  totalChapters: number;
  chapterUpdatedAt: string;
  sourceConnections: MangaSourceConnection[];
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
  media: Anime;
  episode: Episode;
  episodeId: string;
  mediaId?: number;
  userId: string;
  updated_at?: string;
  created_at?: string;
  watchedTime?: number;
}

export interface Read {
  media: Manga;
  mediaId?: number;
  chapterId?: string;
  chapter: Chapter;
  userId: string;
  updated_at?: string;
  created_at?: string;
}

export interface Reaction {
  updated_at?: string;
  created_at?: string;
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
  updated_at?: string;
  created_at?: string;
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

export type Subtitle = {
  file: string;
  lang: string;
  language: string;
};

export type VideoSource = {
  file: string;
  label?: string;
  useProxy?: boolean;
};

export type ImageSource = {
  image: string;
  useProxy?: boolean;
};

export type Room = {
  id: number;
  hostUser: User;
  hostUserId: string;
  mediaId: number;
  media: Anime;
  created_at?: string;
  episode: Episode;
  episodeId: string;
  users: User[];
  title?: string;
  visibility: "public" | "private";
};

export type Chat = {
  body?: string;
  user: User;
  type: "event" | "message";
  eventType?: string;
};

export type ChatMessage = {
  body: string;
  user: User;
};

export type ChatEvent = {
  user: User;
  eventType: string;
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

import { SkeletonProps } from "@/components/shared/Skeleton";
import { Attachment, FileInfo } from "@/services/upload";
import { SupabaseQueryFunction, SupabaseQueryOptions } from "@/utils/supabase";
import { User } from "@supabase/gotrue-js";
import { QueryKey } from "react-query";
import { Media, MediaTitle as ALMediaTitle } from "./anilist";

export interface MediaTitle extends Partial<ALMediaTitle> {
  [key: string]: string;
}

export type AdditionalUser = User & {
  authRole: string;
  isVerified: boolean;
};

export type MediaDescription = Record<string, string>;

export type SourceConnection = {
  id: string;
  sourceId: string;
  sourceMediaId: string;
  mediaId: number;
  source: Source;
  created_at?: string;
  updated_at?: string;
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
  locales: string[];
  addedUserId?: string;
  addedUser?: AdditionalUser;
};

export type Video = {
  fonts: Attachment[];
  subtitles: Attachment[];
  video: FileInfo;
  episodeId: string;
  userId: string;
  hostingId: string;
};

export type Hosting = {
  id: string;
  name: string;
  supportedUrlFormats: string[];
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
  video: Video[];
  published: boolean;
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
  images: {
    images: Attachment[];
  }[];
  published: boolean;
};

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
  media: Media;
  episode: Episode;
  episodeId: string;
  mediaId?: number;
  userId: string;
  updated_at?: string;
  created_at?: string;
  watchedTime?: number;
}

export interface Read {
  media: Media;
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
  media?: Media;
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

export type Font = {
  file: string;
};

export type VideoSource = {
  file: string;
  label?: string;
  useProxy?: boolean;
  proxy?: Proxy;
};

export type ImageSource = {
  image: string;
  useProxy?: boolean;
  proxy?: Proxy;
};

export type Room = {
  id: number;
  hostUser: User;
  hostUserId: string;
  mediaId: number;
  media: Media;
  created_at?: string;
  episode: Episode;
  episodeId: string;
  users: User[];
  title?: string;
  episodes: Episode[];
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

export type WatchStatus = "WATCHING" | "COMPLETED" | "PLANNING";
export type ReadStatus = "READING" | "COMPLETED" | "PLANNING";

export type SourceStatus<T> = (T extends "anime"
  ? {
      status?: WatchStatus;
      mediaId?: number;
      media?: Media;
    }
  : {
      status?: ReadStatus;
      mediaId?: number;
      media?: Media;
    }) & {
  user_id?: number;
  user?: User;
};

export type SkipType = "ed" | "op" | "mixed-ed" | "mixed-op" | "recap";

export interface SkipTimeStamp {
  interval: {
    startTime: number;
    endTime: number;
  };
  skipType: SkipType;
  skipId: string;
  episodeLength: number;
}

export interface AnimeSongTheme {
  title: string;
}
export interface AnimeTheme {
  slug: string;
  song: AnimeSongTheme;
  name: string;
  type: string;
  episode: string;
  sources: VideoSource[];
  anilistId?: number;
}

export interface UploadSubtitle {
  file: File;
  name: string;
  locale: string;
}

export interface Proxy {
  ignoreReqHeaders?: boolean;
  followRedirect?: boolean;
  redirectWithProxy?: boolean;
  decompress?: boolean;
  appendReqHeaders?: Record<string, string>;
  appendResHeaders?: Record<string, string>;
  deleteReqHeaders?: string[];
  deleteResHeaders?: string[];
}

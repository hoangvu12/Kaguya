import { AnimeTheme } from "@/types";
import { randomElement } from "@/utils";
import axios, { AxiosError } from "axios";
import { useRef } from "react";
import { useQuery } from "react-query";

declare module AnimeThemeAPI {
  export interface Song {
    id: number;
    title: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: any;
  }

  export interface Video {
    id: number;
    basename: string;
    filename: string;
    path: string;
    size: number;
    mimetype: string;
    resolution: number;
    nc: boolean;
    subbed: boolean;
    lyrics: boolean;
    uncen: boolean;
    source: string;
    overlap: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: any;
    tags: string;
    link: string;
  }

  export interface Animethemeentry {
    id: number;
    version?: number;
    episodes: string;
    nsfw: boolean;
    spoiler: boolean;
    notes: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: any;
    videos: Video[];
  }

  export interface Animetheme {
    id: number;
    type: string;
    sequence?: any;
    group?: any;
    slug: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: any;
    song: Song;
    animethemeentries: Animethemeentry[];
  }

  export interface Resource {
    external_id: number;
  }

  export interface Anime {
    id: number;
    name: string;
    slug: string;
    year: number;
    season: string;
    synopsis: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: any;
    animethemes: Animetheme[];
    resources: Resource[];
  }

  export interface Links {
    first: string;
    last?: any;
    prev?: any;
    next: string;
  }

  export interface Meta {
    current_page: number;
    from: number;
    path: string;
    per_page: number;
    to: number;
  }

  export interface RandomThemeResponse {
    anime: Anime[];
    links: Links;
    meta: Meta;
  }
  export interface ThemeResponse {
    anime: Anime;
    links: Links;
    meta: Meta;
  }
}

const composeTheme = (
  anime: AnimeThemeAPI.Anime,
  theme = randomElement(anime.animethemes)
): AnimeTheme => {
  const entry = randomElement(theme.animethemeentries);

  return {
    episode: entry.episodes,
    name: anime.name,
    sources: entry?.videos?.map((video) => ({
      file: video.link,
      label: video.tags || video.resolution + "p",
    })),
    slug: anime.slug,
    type: theme.slug,
    song: {
      title: theme?.song?.title,
    },
    anilistId: anime?.resources?.[0]?.external_id,
  };
};

export const fetchRandomTheme = async () => {
  const { data } = await axios.get<AnimeThemeAPI.RandomThemeResponse>(
    "https://api.animethemes.moe/anime?sort=random&page[size]=1&include=animethemes.animethemeentries"
  );

  return composeTheme(data.anime[0]);
};

const fetchThemeByAnime = async (slug: string, type: string) => {
  const { data } = await axios.get<AnimeThemeAPI.ThemeResponse>(
    `https://api.animethemes.moe/anime/${slug}?include=animethemes.animethemeentries.videos,animethemes.song,resources&filter[site]=Anilist&fields[resource]=external_id`
  );

  const theme: AnimeThemeAPI.Animetheme = data.anime.animethemes.find(
    (theme) => theme.slug === type
  );

  return composeTheme(data.anime, theme);
};

interface UseAnimeThemeProps {
  slug: string;
  type: string;
}

export const useAnimeTheme = ({ slug, type }: UseAnimeThemeProps) => {
  return useQuery<AnimeTheme, AxiosError>(
    ["anime-themes", slug, type],
    async ({ queryKey: [_, slug, type] }) =>
      fetchThemeByAnime(slug as string, type as string),
    {
      enabled: !!slug,
      cacheTime: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: 0,
      refetchIntervalInBackground: false,
    }
  );
};

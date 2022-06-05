import { AnimeTheme } from "@/types";
import { randomElement } from "@/utils";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

declare module AnimeThemeAPI {
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
    version?: any;
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
    type: "OP" | "ED";
    sequence?: any;
    group?: any;
    slug: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: any;
    anime: Anime;
    animethemeentries: Animethemeentry[];
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

  export interface Response {
    animethemes: Animetheme[];
    links: Links;
    meta: Meta;
  }
}

export const useAnimeTheme = () => {
  return useQuery<AnimeTheme, AxiosError>(
    "anime-themes",
    async () => {
      const { data } = await axios.get<AnimeThemeAPI.Response>(
        "https://api.animethemes.moe/animetheme?page[size]=1&sort=random&include=anime,animethemeentries.videos&filter[has]=animethemeentries&filter[spoiler]=false&filter[nsfw]=false"
      );

      const theme = data.animethemes[0];
      const entry = randomElement(theme.animethemeentries);

      return {
        episode: entry.episodes,
        name: theme.anime.name,
        sources: entry.videos.map((video) => ({
          file: video.link,
          label: video.tags || video.resolution + "p",
        })),
        type: theme.type,
      };
    },
    {
      cacheTime: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: 0,
      refetchIntervalInBackground: false,
    }
  );
};

import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

export declare module AnimeThemeAPI {
  export interface Song {
    id: number;
    title: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: any;
  }

  export interface Animetheme {
    id: number;
    type: string;
    sequence?: number;
    group: string;
    slug: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: any;
    song: Song;
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
  }

  export interface Search {
    anime: Anime[];
  }

  export interface Response {
    search: Search;
  }
}

const useThemeSearch = (keyword: string, enabled: boolean) => {
  return useQuery<AnimeThemeAPI.Response, AxiosError>(
    ["themeSearch", keyword],
    async () => {
      const res = await axios.get<AnimeThemeAPI.Response>(
        `https://api.animethemes.moe/search?q=${encodeURIComponent(
          keyword
        )}&fields[search]=anime&include[anime]=animethemes.song`
      );
      return res.data;
    },
    {
      enabled,
    }
  );
};

export default useThemeSearch;

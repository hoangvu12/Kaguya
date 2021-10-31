import supabase from "@/lib/supabase";
import { Anime } from "@/types";
import { useSupabaseQuery, UseSupabaseQueryOptions } from "@/utils/supabase";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

interface SortOptions {
  ascending?: boolean;
  nullsFirst?: boolean;
  foreignTable?: string;
}

export interface UseBrowseOptions {
  keyword?: string;
  genre?: string;
  seasonYear?: string;
  season?: string;
  format?: string;
  sort?: string;
  select?: string;
  limit?: number;
}

const useBrowse = (
  options: UseBrowseOptions,
  queryOptions?: UseSupabaseQueryOptions<Anime>
) => {
  return useSupabaseQuery(
    ["browse", options],
    () => {
      const {
        format,
        genre,
        keyword,
        season,
        seasonYear,
        select,
        sort,
        limit = 30,
      } = options;

      let db: PostgrestFilterBuilder<Anime>;

      if (keyword) {
        db = supabase
          .rpc("anime_search", { string: keyword })
          .select(select || "*");
      } else {
        db = supabase.from("anime").select(select || "*");
      }

      if (genre) {
        db = db.contains("genres", `{${genre}}`);
      }

      if (seasonYear) {
        db = db.eq("season_year", Number(seasonYear));
      }

      if (season) {
        db = db.eq("season", season);
      }

      if (format) {
        db = db.eq("format", format);
      }

      if (sort) {
        db = db.order(sort as keyof Anime, { ascending: false });
      }

      if (limit) {
        db = db.limit(limit);
      }

      return db;
    },
    queryOptions
  );
};

export default useBrowse;

import supabase from "@/lib/supabase";
import { Anime, Format, Genre } from "@/types";
import { useSupaInfiniteQuery } from "@/utils/supabase";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export interface UseBrowseOptions {
  keyword?: string;
  genres?: Genre[];
  seasonYear?: string;
  season?: string;
  format?: Format;
  select?: string;
  limit?: number;
  tags?: string[];
  sort?: keyof Anime;
  type?: "anime" | "manga";
  countries?: string[];
}

const useBrowse = (options: UseBrowseOptions) => {
  return useSupaInfiniteQuery(["browse", options], (from, to) => {
    const {
      format,
      genres,
      keyword,
      season,
      seasonYear,
      select,
      sort,
      limit,
      tags,
      countries,
    } = options;

    let db: PostgrestFilterBuilder<Anime>;

    if (keyword) {
      db = supabase
        .rpc("anime_search", {
          string: keyword,
        })
        .select(select || "*");
    } else {
      db = supabase.from("anime").select(select || "*");
    }

    if (genres?.length) {
      db = db.contains("genres", genres);
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

    if (tags?.length) {
      db = db.contains("tags", tags);
    }

    if (countries?.length) {
      db = db.in("country_of_origin", countries);
    }

    if (sort) {
      db = db.order(sort, { ascending: false });
    }

    if (limit) {
      db = db.limit(limit);
    }

    // https://stackoverflow.com/questions/13580826/postgresql-repeating-rows-from-limit-offset
    db = db.order("ani_id", { ascending: false });

    db = db.range(from, to);

    return db;
  });
};

export default useBrowse;

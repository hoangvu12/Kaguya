import supabase from "@/lib/supabase";
import { MediaFormat, MediaStatus } from "@/anilist";
import { Anime, MediaGenre } from "@/types";
import { useSupaInfiniteQuery } from "@/utils/supabase";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export interface UseBrowseOptions {
  keyword?: string;
  genres?: MediaGenre[];
  seasonYear?: string;
  season?: string;
  format?: MediaFormat;
  select?: string;
  limit?: number;
  tags?: string[];
  sort?: keyof Anime;
  countries?: string[];
  status?: MediaStatus;
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
      status,
    } = options;

    let db: PostgrestFilterBuilder<Anime>;

    if (keyword) {
      db = supabase
        .rpc("anime_search", {
          string: keyword,
        })
        .select(select || "*");
    } else {
      db = supabase.from("kaguya_anime").select(select || "*");
    }

    if (genres?.length) {
      db = db.contains("genres", genres);
    }

    if (seasonYear) {
      db = db.eq("seasonYear", Number(seasonYear));
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
      db = db.in("countryOfOrigin", countries);
    }

    if (sort) {
      db = db.order(sort, { ascending: false });
    }

    if (limit) {
      db = db.limit(limit);
    }

    if (status) {
      db = db.eq("status", status);
    }

    // https://stackoverflow.com/questions/13580826/postgresql-repeating-rows-from-limit-offset
    db = db.order("id", { ascending: false });

    db = db.range(from, to);

    return db;
  });
};

export default useBrowse;

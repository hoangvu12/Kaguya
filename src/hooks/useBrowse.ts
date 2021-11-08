import supabase from "@/lib/supabase";
import { Anime } from "@/types";
import { useSupaInfiniteQuery } from "@/utils/supabase";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export interface UseBrowseOptions {
  keyword?: string;
  genre?: string;
  seasonYear?: string;
  season?: string;
  format?: string;
  sort?: keyof Anime;
  select?: string;
  limit?: number;
  tag?: string;
}

const useBrowse = (options: UseBrowseOptions) => {
  return useSupaInfiniteQuery(["browse", options], (from, to) => {
    const {
      format,
      genre,
      keyword,
      season,
      seasonYear,
      select,
      sort,
      limit,
      tag,
    } = options;

    let db: PostgrestFilterBuilder<Anime>;

    if (keyword) {
      db = supabase
        .rpc("anime_search", { string: keyword })
        .select(select || "*");
    } else {
      db = supabase.from("anime").select(select || "*", { count: "exact" });
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

    if (tag) {
      db = db.contains("tags", `{${tag}}`);
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

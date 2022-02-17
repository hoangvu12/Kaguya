import { MediaFormat } from "@/anilist";
import supabase from "@/lib/supabase";
import { MediaStatus } from "@/anilist";
import { Manga, MediaGenre } from "@/types";
import { useSupaInfiniteQuery } from "@/utils/supabase";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export interface UseBrowseOptions {
  keyword?: string;
  genres?: MediaGenre[];
  format?: MediaFormat;
  select?: string;
  limit?: number;
  tags?: string[];
  sort?: keyof Manga;
  countries?: string[];
  status?: MediaStatus;
}

const useBrowse = (options: UseBrowseOptions) => {
  return useSupaInfiniteQuery(["browse", options], (from, to) => {
    const {
      format,
      countries,
      genres,
      keyword,
      select,
      sort,
      limit,
      tags,
      status,
    } = options;

    let db: PostgrestFilterBuilder<Manga>;

    if (keyword) {
      db = supabase
        .rpc("manga_search", {
          string: keyword,
        })
        .select(select || "*");
    } else {
      db = supabase
        .from("kaguya_manga")
        .select(select || "*", { count: "exact" });
    }

    if (genres?.length) {
      db = db.contains("genres", genres);
    }

    if (format) {
      db = db.eq("format", format);
    }

    if (tags?.length) {
      // db = db.in("tags", tags);
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

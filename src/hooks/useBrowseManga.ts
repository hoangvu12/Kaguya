import supabase from "@/lib/supabase";
import { Format, Genre, Manga } from "@/types";
import { useSupaInfiniteQuery } from "@/utils/supabase";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export interface UseBrowseOptions {
  keyword?: string;
  genre?: Genre;
  format?: Format;
  select?: string;
  limit?: number;
  tag?: string;
  sort?: keyof Manga;
  type?: "manga" | "anime";
}

const useBrowse = (options: UseBrowseOptions) => {
  return useSupaInfiniteQuery(["browse", options], (from, to) => {
    const { format, genre, keyword, select, sort, limit, tag } = options;

    let db: PostgrestFilterBuilder<Manga>;

    if (keyword) {
      db = supabase
        .rpc("manga_search", {
          string: keyword,
        })
        .select(select || "*");
    } else {
      db = supabase.from("manga").select(select || "*", { count: "exact" });
    }

    if (genre) {
      db = db.contains("genres", `{${genre}}`);
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

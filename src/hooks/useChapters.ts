import supabaseClient from "@/lib/supabase";
import { MangaSourceConnection } from "@/types";
import { sortMediaUnit } from "@/utils/data";
import { useSupabaseQuery } from "@/utils/supabase";
import { useMemo } from "react";

const query = `
  *,
  chapters:kaguya_chapters(
      *,
      source:kaguya_sources(
          *
      )
  )
`;

const useChapters = (mediaId: number) => {
  const { data, isLoading, ...rest } = useSupabaseQuery(
    ["chapters", mediaId],
    () =>
      supabaseClient
        .from<MangaSourceConnection>("kaguya_manga_source")
        .select(query)
        .eq("mediaId", mediaId)
  );

  const chapters = useMemo(
    () => data?.flatMap((connection) => connection.chapters),
    [data]
  );

  const sortedChapters = useMemo(
    () => (isLoading ? [] : sortMediaUnit(chapters)),
    [chapters, isLoading]
  );

  return { data: sortedChapters, isLoading, ...rest };
};

export default useChapters;

import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { MangaSourceConnection } from "@/types";
import { sortMediaUnit } from "@/utils/data";
import { useSupabaseQuery } from "@/utils/supabase";
import { useMemo } from "react";

const query = `
  *,
  chapters:kaguya_chapters(
      *,
      source:kaguya_sources(
          id,
          name,
          locales
      )
  )
`;

const useChapters = (mediaId: number) => {
  const { data, isLoading, ...rest } = useSupabaseQuery(
    ["chapters", mediaId],
    () =>
      supabase
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

import supabase from "@/lib/supabase";
import { Manga } from "@/types";
import { sortMediaUnit } from "@/utils/data";
import { useSupabaseSingleQuery } from "@/utils/supabase";
import { useMemo } from "react";

const query = `
sourceConnections:kaguya_manga_source!mediaId(
    *,
    chapters:kaguya_chapters(
        *,
        source:kaguya_sources(
            id,
            name,
            locales
        )
    )
)
`;

const useChapters = (mediaId: number) => {
  const { data, isLoading, ...rest } = useSupabaseSingleQuery(
    ["chapters", mediaId],
    () =>
      supabase
        .from<Manga>("kaguya_manga")
        .select(query)
        .eq("id", mediaId)
        .single()
  );

  const chapters = useMemo(
    () => data?.sourceConnections?.flatMap((connection) => connection.chapters),
    [data?.sourceConnections]
  );

  const sortedChapters = useMemo(
    () => (isLoading ? [] : sortMediaUnit(chapters)),
    [chapters, isLoading]
  );

  return { data: sortedChapters, isLoading, ...rest };
};

export default useChapters;

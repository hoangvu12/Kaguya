import supabase from "@/lib/supabase";
import { Anime } from "@/types";
import { parseNumberFromString } from "@/utils";
import { sortMediaUnit } from "@/utils/data";
import { useSupabaseSingleQuery } from "@/utils/supabase";
import { useMemo } from "react";

const query = `
sourceConnections:kaguya_anime_source!mediaId(
    *,
    episodes:kaguya_episodes(
        *,
        source:kaguya_sources(
            id,
            name,
            locales
        )
    )
)
`;

const useEpisodes = (mediaId: number) => {
  const { data, isLoading, ...rest } = useSupabaseSingleQuery(
    ["episodes", mediaId],
    () =>
      supabase
        .from<Anime>("kaguya_anime")
        .select(query)
        .eq("id", mediaId)
        .single()
  );

  const episodes = useMemo(
    () => data?.sourceConnections?.flatMap((connection) => connection.episodes),
    [data?.sourceConnections]
  );

  const sortedEpisodes = useMemo(
    () => (isLoading ? [] : sortMediaUnit(episodes)),
    [episodes, isLoading]
  );

  return { data: sortedEpisodes, isLoading, ...rest };
};

export default useEpisodes;

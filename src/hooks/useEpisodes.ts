import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { AnimeSourceConnection } from "@/types";
import { sortMediaUnit } from "@/utils/data";
import { useSupabaseSingleQuery } from "@/utils/supabase";
import { useMemo } from "react";

const query = `
  *,
  episodes:kaguya_episodes(
      *,
      source:kaguya_sources(
          id,
          name,
          locales
      )
  )
`;

const useEpisodes = (mediaId: number) => {
  const { data, isLoading, ...rest } = useSupabaseSingleQuery(
    ["episodes", mediaId],
    () =>
      supabase
        .from<AnimeSourceConnection>("kaguya_anime_source")
        .select(query)
        .eq("mediaId", mediaId)
  );

  const episodes = useMemo(
    () => data?.flatMap((connection) => connection.episodes),
    [data]
  );

  const sortedEpisodes = useMemo(
    () =>
      isLoading
        ? []
        : sortMediaUnit(episodes.filter((episode) => episode.published)),
    [episodes, isLoading]
  );

  return { data: sortedEpisodes, isLoading, ...rest };
};

export default useEpisodes;

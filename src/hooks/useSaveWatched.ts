import { useUser } from "@supabase/auth-helpers-react";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { Watched } from "@/types";
import axios from "axios";
import { useMutation } from "react-query";

interface MutationInput {
  media_id: number;
  episode_id: string;
  watched_time?: number;
}

const useSaveWatched = () => {
  const { user } = useUser();

  return useMutation(async (data: MutationInput) => {
    if (!user) return;

    const { episode_id, media_id, watched_time } = data;

    const { error: upsertError } = await supabase
      .from<Watched>("kaguya_watched")
      .upsert(
        {
          mediaId: media_id,
          episodeId: episode_id,
          userId: user.id,
          watchedTime: watched_time,
        },
        { returning: "minimal" }
      );

    if (upsertError) throw upsertError;

    return true;
  });
};

export default useSaveWatched;

import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { Read } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "react-query";
import { getMedia } from "@/services/anilist";
import { MediaType } from "@/types/anilist";
import { isMobile } from "react-device-detect";

const useRead = () => {
  const { user } = useUser();

  return useQuery<Read[]>(
    "read",
    async () => {
      const { data, error } = await supabase
        .from<Read>("kaguya_read")
        .select(
          "mediaId, chapter:kaguya_chapters!chapterId(sourceChapterId, name, sourceId)"
        )
        .eq("userId", user.id)
        .order("updated_at", { ascending: false })
        .limit(isMobile ? 5 : 10);

      if (error) throw error;

      const anilistMedia = await getMedia({
        id_in: data.map((read) => read.mediaId),
        type: MediaType.Manga,
      });

      return data.map((read) => {
        const media = anilistMedia.find((media) => media.id === read.mediaId);

        return {
          ...read,
          media,
        };
      });
    },
    { enabled: !!user }
  );
};

export default useRead;

import supabase from "@/lib/supabase";
import { Read } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";
import { useUser } from "@/contexts/AuthContext";
import { useQuery } from "react-query";
import { getMedia } from "@/services/anilist";
import { MediaType } from "@/types/anilist";

const useRead = () => {
  const user = useUser();

  return useQuery<Read[]>(
    "read",
    async () => {
      const { data, error } = await supabase
        .from<Read>("kaguya_read")
        .select(
          "mediaId, chapter:kaguya_chapter!chapterId(sourceChapterId, name, sourceId)"
        )
        .eq("userId", user.id)
        .order("updated_at", { ascending: false })
        .limit(15);

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

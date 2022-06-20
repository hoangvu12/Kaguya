import { useUser } from "@supabase/auth-helpers-react";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { getMedia, getMediaDetails } from "@/services/anilist";
import { mediaDefaultFields } from "@/services/anilist/queries";
import { Read } from "@/types";
import { MediaType } from "@/types/anilist";
import { useSupabaseSingleQuery } from "@/utils/supabase";
import { useQuery } from "react-query";

const useMangaRecommendedList = () => {
  const { user } = useUser();

  return useQuery<Read>(
    ["manga", "recommended"],
    async () => {
      const { data, error } = await supabase
        .from<Read>("kaguya_read")
        .select("mediaId")
        .eq("userId", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      const anilistMedia = await getMediaDetails(
        {
          id: data.mediaId,
          perPage: 1,
          type: MediaType.Manga,
        },
        `
        title {
          romaji
          english
          native
          userPreferred
        }
        recommendations(sort: [RATING_DESC, ID]) {
          nodes {
            mediaRecommendation {
              ${mediaDefaultFields}
            }
          }
        }
        `
      );

      console.log(anilistMedia);

      return {
        ...data,
        media: anilistMedia,
      };
    },
    { enabled: !!user }
  );
};

export default useMangaRecommendedList;

import { getMediaDetails } from "@/services/anilist";
import { mediaDefaultFields } from "@/services/anilist/queries";
import { Read } from "@/types";
import { MediaType } from "@/types/anilist";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { isMobile } from "react-device-detect";
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
        recommendations(sort: [RATING_DESC, ID], perPage: ${
          isMobile ? 5 : 10
        }) {
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

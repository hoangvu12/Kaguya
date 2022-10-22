import { getMediaDetails } from "@/services/anilist";
import { mediaDefaultFields } from "@/services/anilist/queries";
import { Read } from "@/types";
import { MediaType } from "@/types/anilist";
import supabaseClient from "@/lib/supabase";

import { useUser } from "@/contexts/AuthContext";
import { isMobile } from "react-device-detect";
import { useQuery } from "react-query";

const useMangaRecommendedList = () => {
  const user = useUser();

  return useQuery<Read>(
    ["manga", "recommended"],
    async () => {
      const { data, error } = await supabaseClient
        .from<Read>("kaguya_read")
        .select("mediaId")
        .eq("userId", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      const media = await getMediaDetails(
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

      return {
        ...data,
        media,
      };
    },
    { enabled: !!user }
  );
};

export default useMangaRecommendedList;

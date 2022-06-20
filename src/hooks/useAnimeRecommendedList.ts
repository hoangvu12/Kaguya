import { useUser } from "@supabase/auth-helpers-react";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { getMedia, getMediaDetails } from "@/services/anilist";
import { mediaDefaultFields } from "@/services/anilist/queries";
import { Watched } from "@/types";
import { useQuery } from "react-query";

const useAnimeRecommendedList = () => {
  const { user } = useUser();

  return useQuery<Watched>(
    ["anime", "recommended"],
    async () => {
      const { data, error } = await supabase
        .from<Watched>("kaguya_watched")
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

      return {
        ...data,
        media: anilistMedia,
      };
    },
    { enabled: !!user }
  );
};

export default useAnimeRecommendedList;

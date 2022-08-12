import { getMedia } from "@/services/anilist";
import { Comment } from "@/types";
import { MediaType } from "@/types/anilist";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";

const useNewestComments = (type: MediaType) => {
  return useQuery(["newest-comments", type], async () => {
    const { data, error } = await supabaseClient
      .from<Comment>("sce_comments_with_metadata")
      .select("*,user:sce_display_users!user_id(*)")
      .like("topic", `${type.toLowerCase()}%`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const mediaIds = data.map((comment) => {
      const [_, mediaId] = comment.topic.split("-");

      return Number(mediaId);
    });

    const mediaList = await getMedia({ id_in: mediaIds });

    return data.map((comment) => {
      const [_, mediaId] = comment.topic.split("-");

      const media = mediaList.find((media) => media.id === Number(mediaId));

      return {
        comment,
        media,
      };
    });
  });
};

export default useNewestComments;

import { useUser } from "@/contexts/AuthContext";
import supabaseClient from "@/lib/supabase";
import { Read, SourceStatus } from "@/types";
import { MediaType } from "@/types/anilist";
import { useMutation, useQueryClient } from "react-query";

interface MutationInput {
  media_id: number;
  chapter_id: string;
}

const useSaveRead = () => {
  const user = useUser();
  const queryClient = useQueryClient();

  return useMutation(async (data: MutationInput) => {
    if (!user) return;

    const { chapter_id, media_id } = data;

    const sourceStatus = queryClient.getQueryData<
      SourceStatus<MediaType.Manga>
    >(["kaguya_read_status", media_id]);

    if (sourceStatus?.status !== "COMPLETED") {
      await supabaseClient.from("kaguya_read_status").upsert({
        userId: user.id,
        mediaId: media_id,
        status: "READING",
      });
    }

    const { error: upsertError } = await supabaseClient
      .from<Read>("kaguya_read")
      .upsert(
        {
          mediaId: media_id,
          userId: user.id,
          chapterId: chapter_id,
        },
        { returning: "minimal" }
      );

    if (upsertError) throw upsertError;

    return true;
  });
};

export default useSaveRead;

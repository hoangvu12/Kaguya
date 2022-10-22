import { useUser } from "@/contexts/AuthContext";
import supabaseClient from "@/lib/supabase";
import { Read } from "@/types";
import { useMutation } from "react-query";

interface MutationInput {
  media_id: number;
  chapter_id: string;
}

const useSaveRead = () => {
  const user = useUser();

  return useMutation(async (data: MutationInput) => {
    if (!user) return;

    const { chapter_id, media_id } = data;

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

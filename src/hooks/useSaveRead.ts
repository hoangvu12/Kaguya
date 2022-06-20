import { useUser } from "@supabase/auth-helpers-react";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { Read } from "@/types";
import axios from "axios";
import { useMutation } from "react-query";

interface MutationInput {
  media_id: number;
  chapter_id: string;
}

const useSaveRead = () => {
  const { user } = useUser();

  return useMutation(async (data: MutationInput) => {
    if (!user) return;

    const { chapter_id, media_id } = data;

    const { error: upsertError } = await supabase
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

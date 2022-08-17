import { Translation } from "@/types";
import { MediaType } from "@/types/anilist";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

const useSaveTranslation = (mediaId: number, mediaType: MediaType) => {
  const { user } = useUser();

  return useMutation<Translation, PostgrestError, Translation, any>(
    async (translation) => {
      if (!user) throw new Error("Please login to save translation");

      const { data, error } = await supabaseClient
        .from<Translation>("kaguya_translations")
        .upsert({
          description: translation.description,
          title: translation.title,
          locale: translation.locale,
          mediaId,
          mediaType,
        })
        .single();

      if (error) throw error;

      return data;
    },
    {
      onSuccess: () => {
        toast.success("Translation saved");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export default useSaveTranslation;

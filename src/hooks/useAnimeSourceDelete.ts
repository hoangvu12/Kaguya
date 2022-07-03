import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

const useAnimeSourceDelete = (sourceMediaId: string) => {
  return useMutation(
    async () => {
      const { error } = await supabaseClient
        .from("kaguya_anime_source")
        .delete({ returning: "minimal" })
        .match({ sourceMediaId });

      if (error) {
        throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        toast.success("Anime source deleted successfully");
      },
      onError: (error: AxiosError) => {
        toast.error(error.message);
      },
    }
  );
};

export default useAnimeSourceDelete;

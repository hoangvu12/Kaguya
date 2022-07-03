import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

const useEpisodeDelete = (slug: string) => {
  return useMutation(
    async () => {
      const { error } = await supabaseClient
        .from("kaguya_episodes")
        .delete()
        .match({ slug });

      if (error) {
        throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        toast.success("Episode deleted successfully");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }
  );
};

export default useEpisodeDelete;

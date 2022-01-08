import { Anime } from "@/types";
import { PostgrestError } from "@supabase/supabase-js";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useEditAnime = (animeId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["anime", animeId];

  return useMutation<any, PostgrestError, Anime, any>(
    async (data) => axios.patch(`/api/anime/edit?id=${animeId}`, data),
    {
      onMutate: (data) => {
        const anime = queryClient.getQueryData<Anime>(queryKey);

        if (!anime) {
          throw new Error("Anime not found");
        }

        queryClient.setQueryData(queryKey, { ...anime, ...data });
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
    }
  );
};

export default useEditAnime;

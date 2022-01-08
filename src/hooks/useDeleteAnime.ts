import { PostgrestError } from "@supabase/supabase-js";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useDeleteAnime = (animeId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["anime", animeId];

  return useMutation<any, PostgrestError, any, any>(
    async () => axios.delete(`/api/anime/delete?id=${animeId}`),
    {
      onMutate: () => {
        queryClient.setQueryData(queryKey, null);
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
    }
  );
};

export default useDeleteAnime;

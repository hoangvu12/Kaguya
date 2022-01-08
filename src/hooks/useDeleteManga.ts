import { PostgrestError } from "@supabase/supabase-js";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useDeleteAnime = (mangaId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["manga", mangaId];

  return useMutation<any, PostgrestError, any, any>(
    async () => axios.delete(`/api/manga/delete?id=${mangaId}`),
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

import { Manga } from "@/types";
import { PostgrestError } from "@supabase/supabase-js";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useEditManga = (mangaId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["manga", mangaId];

  return useMutation<any, PostgrestError, Manga, any>(
    async (data) => axios.patch(`/api/manga/edit?id=${mangaId}`, data),
    {
      onMutate: (data) => {
        const manga = queryClient.getQueryData<Manga>(queryKey);

        if (!manga) {
          throw new Error("Manga not found");
        }

        queryClient.setQueryData(queryKey, { ...manga, ...data });
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
    }
  );
};

export default useEditManga;

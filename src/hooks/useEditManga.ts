import { Manga } from "@/types";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

interface ReturnSuccess {
  success: true;
}
interface ReturnError {
  success: false;
  error: string;
}

const useEditManga = (mangaId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["manga", mangaId];

  return useMutation<ReturnSuccess, ReturnError, Manga, any>(
    async (data) => axios.patch(`/api/manga/edit?id=${mangaId}`, data),
    {
      onMutate: (data) => {
        const manga = queryClient.getQueryData<Manga>(queryKey);

        if (!manga) {
          throw new Error("Manga not found");
        }

        queryClient.setQueryData(queryKey, { ...manga, ...data });
      },
      onSuccess: () => {
        toast.success("Anime updated successfully");
      },
      onError: (error) => {
        toast.error(error.error);
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
    }
  );
};

export default useEditManga;

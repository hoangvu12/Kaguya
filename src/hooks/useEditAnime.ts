import { Anime } from "@/types";
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

const useEditAnime = (animeId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["anime", animeId];

  return useMutation<ReturnSuccess, ReturnError, Anime, any>(
    async (data) => axios.patch(`/api/anime/edit?id=${animeId}`, data),
    {
      onMutate: (data) => {
        const anime = queryClient.getQueryData<Anime>(queryKey);

        if (!anime) {
          throw new Error("Anime not found");
        }

        queryClient.setQueryData(queryKey, { ...anime, ...data });
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

export default useEditAnime;

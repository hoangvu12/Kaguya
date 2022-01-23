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

const useDeleteAnime = (animeId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["anime", animeId];

  return useMutation<ReturnSuccess, ReturnError, any, any>(
    async () => axios.delete(`/api/anime/delete?id=${animeId}`),
    {
      onMutate: () => {
        queryClient.setQueryData(queryKey, null);
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
      onSuccess: () => {
        toast.success("Anime deleted successfully");
      },
      onError: (error) => {
        toast.error(error.error);
      },
    }
  );
};

export default useDeleteAnime;

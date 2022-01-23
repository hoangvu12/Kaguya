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

const useDeleteAnime = (mangaId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["manga", mangaId];

  return useMutation<ReturnSuccess, ReturnError, any, any>(
    async () => axios.delete(`/api/manga/delete?id=${mangaId}`),
    {
      onMutate: () => {
        queryClient.setQueryData(queryKey, null);
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
      onSuccess: () => {
        toast.success("Manga deleted successfully");
      },
      onError: (error) => {
        toast.error(error.error);
      },
    }
  );
};

export default useDeleteAnime;

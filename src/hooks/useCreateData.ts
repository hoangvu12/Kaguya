import { Anime, Manga } from "@/types";
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

const useCreateData = <T extends "anime" | "manga">(type: T) => {
  const queryClient = useQueryClient();

  return useMutation<
    ReturnSuccess,
    ReturnError,
    T extends "anime" ? Anime : Manga,
    any
  >(
    (data) => {
      return axios
        .post<ReturnSuccess>(`/api/create?type=${type}`, data)
        .then(({ data }) => data);
    },
    {
      onMutate(body) {
        const queryKey = [type, body.ani_id];

        queryClient.setQueryData(queryKey, body);
      },

      onSuccess() {
        toast.success("Data created successfully");
      },

      onError(error) {
        toast.error(error.error);
      },

      onSettled(_, __, body) {
        const queryKey = [type, body.ani_id];

        queryClient.invalidateQueries(queryKey);
      },
    }
  );
};

export default useCreateData;

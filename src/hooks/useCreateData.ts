import { Anime, Manga } from "@/types";
import { PostgrestError } from "@supabase/supabase-js";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

type ReturnData =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

const useCreateData = <T extends "anime" | "manga">(type: T) => {
  const queryClient = useQueryClient();

  return useMutation<
    ReturnData,
    PostgrestError,
    T extends "anime" ? Anime : Manga,
    any
  >(
    (data) => {
      return axios
        .post<ReturnData>(`/api/create?type=${type}`, data)
        .then(({ data }) => data);
    },
    {
      onMutate(body) {
        const queryKey = [type, body.ani_id];

        queryClient.setQueryData(queryKey, body);
      },

      onSettled(_, __, body) {
        const queryKey = [type, body.ani_id];

        queryClient.invalidateQueries(queryKey);
      },
    }
  );
};

export default useCreateData;

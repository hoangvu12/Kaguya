import { READ_STATUS, WATCH_STATUS } from "@/constants";
import { useUser } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { Anime, Manga, SourceStatus } from "@/types";
import { getTitle } from "@/utils/data";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

type StatusInput<T> = T extends "anime"
  ? typeof WATCH_STATUS[number]["value"]
  : typeof READ_STATUS[number]["value"];

const useModifySourceStatus = <T extends "anime" | "manga">(
  type: T,
  source: T extends "anime" ? Anime : Manga
) => {
  const tableName =
    type === "anime" ? "kaguya_watch_status" : "kaguya_read_status";
  const queryKey = [tableName, source.id];
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation<any, PostgrestError, StatusInput<T>, any>(
    async (status) => {
      const upsertValue = {
        status,
        userId: user.id,
        mediaId: source.id,
      };

      const { data, error } = await supabase
        .from(tableName)
        .upsert(upsertValue);

      if (error) throw error;

      return data;
    },

    {
      onMutate: (status) => {
        const oldStatus = queryClient.getQueryData<SourceStatus<T>>(queryKey);

        queryClient.setQueryData(queryKey, { ...oldStatus, status });
      },
      onSuccess: (_, status) => {
        const { label } =
          type === "anime"
            ? WATCH_STATUS.find(({ value }) => value === status)
            : READ_STATUS.find(({ value }) => value === status);

        toast.success(
          <p>
            Đã thêm <b>{getTitle(source)}</b> vào <b>{label}</b>
          </p>
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
    }
  );
};

export default useModifySourceStatus;

import { useUser } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { Anime, Manga } from "@/types";
import { getTitle } from "@/utils/data";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

type Source<T> = T extends "anime" ? Anime : Manga;

const useSubscribe = <T extends "anime" | "manga">(
  type: T,
  source: Source<T>
) => {
  const user = useUser();
  const queryClient = useQueryClient();
  const tableName =
    type === "anime" ? "anime_subscribers" : "manga_subscribers";
  const queryKey = ["is_subscribed", user.id, source.ani_id];

  const upsertValue =
    type === "anime"
      ? { anime_id: source.ani_id }
      : { manga_id: source.ani_id };

  return useMutation<any, PostgrestError, any, any>(
    async () => {
      const { data, error } = await supabase
        .from(tableName)
        .upsert({ user_id: user.id, ...upsertValue });

      if (error) throw error;

      return data;
    },
    {
      onMutate: () => {
        queryClient.setQueryData(queryKey, true);
      },
      onSuccess: () => {
        toast.success(
          <p>
            Đã bật thông báo <b>{getTitle(source)}</b>{" "}
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

export default useSubscribe;

import { useUser } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { Anime, Manga } from "@/types";
import { getTitle } from "@/utils/data";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

type Source<T> = T extends "anime" ? Anime : Manga;

const useUnsubscribe = <T extends "anime" | "manga">(
  type: T,
  source: Source<T>
) => {
  const user = useUser();
  const queryClient = useQueryClient();
  const tableName =
    type === "anime" ? "kaguya_anime_subscribers" : "kaguya_manga_subscribers";
  const queryKey = ["is_subscribed", user.id, source.id];

  return useMutation<any, PostgrestError, any, any>(
    async () => {
      const { data, error } = await supabase
        .from(tableName)
        .delete({ returning: "minimal" })
        .match({ userId: user.id, mediaId: source.id });

      if (error) throw error;

      return data;
    },
    {
      onMutate: () => {
        queryClient.setQueryData(queryKey, false);
      },
      onSuccess: () => {
        toast.success(
          <p>
            Đã tắt thông báo <b>{getTitle(source)}</b>{" "}
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

export default useUnsubscribe;

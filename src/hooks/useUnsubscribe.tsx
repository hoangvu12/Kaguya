import { useUser } from "@supabase/auth-helpers-react";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { Media } from "@/types/anilist";
import { getTitle } from "@/utils/data";
import { PostgrestError } from "@supabase/supabase-js";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

const useUnsubscribe = <T extends "anime" | "manga">(
  type: T,
  source: Media
) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { locale } = useRouter();
  const { t } = useTranslation("notification");
  const mediaTitle = useMemo(() => getTitle(source, locale), [locale, source]);

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
        toast.success(t("unsubscribed_msg", { mediaTitle }));
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

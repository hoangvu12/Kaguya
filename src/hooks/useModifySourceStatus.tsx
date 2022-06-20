import { useUser } from "@supabase/auth-helpers-react";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { SourceStatus } from "@/types";
import { Media } from "@/types/anilist";
import { getTitle } from "@/utils/data";
import { PostgrestError } from "@supabase/supabase-js";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import useConstantTranslation from "./useConstantTranslation";

const useModifySourceStatus = <T extends "anime" | "manga">(
  type: T,
  source: Media
) => {
  const { WATCH_STATUS, READ_STATUS } = useConstantTranslation();

  type StatusInput = T extends "anime"
    ? typeof WATCH_STATUS[number]["value"]
    : typeof READ_STATUS[number]["value"];

  const { locale } = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation("source_status");
  const { user } = useUser();
  const mediaTitle = useMemo(() => getTitle(source, locale), [locale, source]);

  const tableName =
    type === "anime" ? "kaguya_watch_status" : "kaguya_read_status";
  const queryKey = [tableName, source.id];

  return useMutation<any, PostgrestError, StatusInput, any>(
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

        queryClient.setQueryData(queryKey, {
          ...oldStatus,
          status,
        });
      },
      onSuccess: (_, status) => {
        const { label } =
          type === "anime"
            ? WATCH_STATUS.find(({ value }) => value === status)
            : READ_STATUS.find(({ value }) => value === status);

        toast.success(t("added_to_list_msg", { mediaTitle, label }));
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

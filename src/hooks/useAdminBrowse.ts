import supabase from "@/lib/supabase";
import { Anime, Manga } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";

export interface UseAdminBrowseOptions {
  keyword?: string;
  source_id?: number;
  ani_id?: number;
}

const initialOptions: UseAdminBrowseOptions = {
  keyword: "",
  source_id: null,
  ani_id: null,
};

const useAdminBrowse = <T extends "anime" | "manga">(type: T) => {
  const [query, setQuery] = useState<UseAdminBrowseOptions>(initialOptions);
  const { keyword, source_id, ani_id } = query;

  const { handleSubmit, ...form } = useForm<UseAdminBrowseOptions>({
    defaultValues: initialOptions,
  });

  const queryClient = useQueryClient();

  const isAnime = useMemo(() => type === "anime", [type]);
  const isDisabled = useMemo(
    () => Object.values(query).every((option) => !option),
    [query]
  );
  const onSubmit = handleSubmit(setQuery);

  const queryResult = useSupabaseQuery(
    ["admin-browse", query],
    () => {
      let db: PostgrestFilterBuilder<T extends "anime" ? Anime : Manga>;

      if (keyword) {
        db = supabase
          .rpc(isAnime ? "anime_search" : "manga_search", {
            string: keyword,
          })
          .select("*");
      } else {
        db = supabase.from("anime").select("*");
      }

      if (source_id) {
        // @ts-ignore
        db = db.eq("source_id", source_id);
      }

      if (ani_id) {
        // @ts-ignore
        db = db.eq("ani_id", ani_id);
      }

      return db;
    },
    {
      enabled: !isDisabled,
      retry: 0,
      onSuccess: (list) => {
        list.forEach((data) => {
          const queryKey = [type, data.ani_id];

          queryClient.setQueryData(queryKey, data);
        });
      },
    }
  );

  return {
    ...form,
    ...queryResult,
    onSubmit,
  };
};

export default useAdminBrowse;

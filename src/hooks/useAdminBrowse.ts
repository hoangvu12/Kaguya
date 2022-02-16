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
  id?: number;
}

const initialOptions: UseAdminBrowseOptions = {
  keyword: "",
  source_id: null,
  id: null,
};

const useAdminBrowse = <T extends "anime" | "manga">(type: T) => {
  const [query, setQuery] = useState<UseAdminBrowseOptions>(initialOptions);
  const { keyword, source_id, id } = query;

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
    ["admin-browse", query, type],
    () => {
      let db: PostgrestFilterBuilder<T extends "anime" ? Anime : Manga>;

      if (keyword) {
        db = supabase
          .rpc(isAnime ? "anime_search" : "manga_search", {
            string: keyword,
          })
          .select("*");
      } else {
        db = supabase.from(type === "anime" ? "anime" : "manga").select("*");
      }

      if (source_id) {
        // @ts-ignore
        db = db.eq("source_id", source_id);
      }

      if (id) {
        // @ts-ignore
        db = db.eq("id", id);
      }

      return db;
    },
    {
      enabled: !isDisabled,
      retry: 0,
      onSuccess: (list) => {
        list.forEach((data) => {
          const queryKey = [type, data.id];

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

import { Anime, Manga } from "@/types";
import axios from "axios";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";

type UseFetchInfoProps<T> = T extends "anime"
  ? {
      ani_id?: number;
      source_id?: number;
    }
  : {
      slug?: string;
      ani_id?: number;
      source_id?: number;
    };

const initialOptions: UseFetchInfoProps<"manga"> = {
  ani_id: 0,
  source_id: 0,
  slug: "",
};

const useFetchInfo = <T extends "anime" | "manga">(type: T) => {
  const [query, setQuery] = useState<UseFetchInfoProps<T>>(initialOptions);

  const { handleSubmit, ...form } = useForm<UseFetchInfoProps<T>>();

  const queryClient = useQueryClient();

  const onSubmit = handleSubmit(setQuery);

  const isEnabled = useMemo(
    () => Object.values(query).every((val) => val),
    [query]
  );

  const queryResult = useQuery(
    ["info", query],
    () => {
      return axios
        .get<T extends "anime" ? Anime : Manga>("/api/info", {
          params: query,
        })
        .then(({ data }) => data);
    },
    {
      enabled: isEnabled,
      onSuccess: (info) => {
        if (type === "anime") {
          queryClient.setQueryData(["anime", info.ani_id], info);
        } else if (type === "manga") {
          queryClient.setQueryData(["manga", info.ani_id], info);
        }
      },
    }
  );

  return {
    ...form,
    ...queryResult,
    onSubmit,
  };
};

export default useFetchInfo;

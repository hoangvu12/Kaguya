import {
  PostgrestError,
  PostgrestFilterBuilder,
  PostgrestSingleResponse,
} from "@supabase/postgrest-js";
import { QueryKey, QueryOptions, useQuery } from "react-query";

export interface SupabaseQueryFunction<T> {
  (): PostgrestSingleResponse<T> | PostgrestFilterBuilder<T>;
}

export const useSupabaseQuery = <T>(
  key: QueryKey,
  queryFn: SupabaseQueryFunction<T>,
  options?: QueryOptions<T | T[]>
) => {
  return useQuery<T | T[], PostgrestError>(
    key,
    async () => {
      const { data, error } = await queryFn();

      if (error) {
        throw error;
      }

      return data;
    },
    options
  );
};

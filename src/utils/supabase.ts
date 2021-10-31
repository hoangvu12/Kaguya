import { PostgrestError, PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { QueryKey, useQuery, UseQueryOptions } from "react-query";

export interface SupabaseQueryFunction<T> {
  (): PostgrestFilterBuilder<T>;
}

export interface UseSupabaseQueryOptions<T>
  extends UseQueryOptions<T[], PostgrestError> {}

export const useSupabaseQuery = <T>(
  key: QueryKey,
  queryFn: SupabaseQueryFunction<T>,
  options?: UseQueryOptions<T[], PostgrestError>
) => {
  return useQuery<T[], PostgrestError>(
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

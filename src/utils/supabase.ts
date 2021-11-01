import supabase from "@/lib/supabase";
import { PostgrestError, PostgrestFilterBuilder } from "@supabase/postgrest-js";
import {
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
  UseQueryOptions,
} from "react-query";
import { getPagination } from ".";

export interface SupabaseQueryFunction<T> {
  (): PostgrestFilterBuilder<T>;
}

export interface SupabaseInfiniteQueriesFunction<T> {
  (from: number, to: number): PostgrestFilterBuilder<T>;
}

export type UseSupabaseQueryOptions<T> = Omit<
  UseQueryOptions<T[], PostgrestError, T[], QueryKey>,
  "queryKey" | "queryFn"
>;

export const useSupabaseQuery = <T>(
  key: QueryKey,
  queryFn: SupabaseQueryFunction<T>,
  options?: Omit<
    UseQueryOptions<T[], PostgrestError, T[], QueryKey>,
    "queryKey" | "queryFn"
  >
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

export const useSupaInfiniteQueries = <T>(
  key: QueryKey,
  queryFn: SupabaseInfiniteQueriesFunction<T>
) => {
  return useInfiniteQuery(
    key,
    async ({ pageParam = 1 }) => {
      const { from, to } = getPagination(pageParam, 30);

      const { data, error } = await queryFn(from, to);

      if (error) {
        throw error;
      }

      return { data, nextPage: data.length ? pageParam + 1 : null };
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );
};

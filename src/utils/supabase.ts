import {
  PostgrestError,
  PostgrestFilterBuilder,
  PostgrestSingleResponse,
} from "@supabase/postgrest-js";
import {
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
  UseQueryOptions,
} from "react-query";
import { getPagination } from ".";

export type SupabaseQueryFunction<T> = () => PostgrestFilterBuilder<T>;

export type SupabaseInfiniteQueriesFunction<T> = (
  from: number,
  to: number
) => PostgrestFilterBuilder<T>;

export type SupabaseSingleQueryFunction<T> = () => PromiseLike<
  PostgrestSingleResponse<T>
>;

export type SupabaseQueryOptions<T> = Omit<
  UseQueryOptions<T[], PostgrestError, T[], QueryKey>,
  "queryKey" | "queryFn"
>;

export type SupabaseSingleQueryOptions<T> = Omit<
  UseQueryOptions<T, PostgrestError, T, QueryKey>,
  "queryKey" | "queryFn"
>;

export type SupabaseInfiniteQueryOptions<T> = Omit<
  UseInfiniteQueryOptions<
    InfiniteQueryData<T>,
    PostgrestError,
    InfiniteQueryData<T>
  >,
  "queryFn" | "queryKey"
>;

export const useSupabaseQuery = <T>(
  key: QueryKey,
  queryFn: SupabaseQueryFunction<T>,
  options?: SupabaseQueryOptions<T>
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

export const useSupabaseSingleQuery = <T>(
  key: QueryKey,
  queryFn: SupabaseSingleQueryFunction<T>,
  options?: SupabaseSingleQueryOptions<T>
) => {
  return useQuery<T, PostgrestError>(
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

type InfiniteQueryData<T> = {
  data: T[];
  nextPage: any;
};

export const useSupaInfiniteQuery = <T>(
  key: QueryKey,
  queryFn: SupabaseInfiniteQueriesFunction<T>,
  options?: SupabaseInfiniteQueryOptions<T>
) => {
  return useInfiniteQuery(
    key,
    async ({ pageParam = 1 }) => {
      const LIMIT = 30;
      const { from, to } = getPagination(pageParam, LIMIT);

      const { data, error } = await queryFn(from, to);

      if (error) {
        return {
          data: [],
          nextPage: null,
        };
      }

      const hasNextPage = data?.length && data?.length === LIMIT;

      return { data, nextPage: hasNextPage ? pageParam + 1 : null };
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      ...options,
    }
  );
};

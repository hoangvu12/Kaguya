import { getRecommendations } from "@/services/anilist";
import { PageArgs, Recommendation, RecommendationArgs } from "@/types/anilist";
import { AxiosError } from "axios";
import { useQuery, UseQueryOptions } from "react-query";

const useRecommendations = (
  args: RecommendationArgs & PageArgs,
  options?: Omit<
    UseQueryOptions<Recommendation[], AxiosError, Recommendation[]>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<Recommendation[]>(
    ["recommendation", { args }],
    () => getRecommendations(args),
    options
  );
};

export default useRecommendations;

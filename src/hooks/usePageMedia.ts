import { getPageMedia } from "@/services/anilist";
import { MediaArgs, Page, PageArgs } from "@/types/anilist";
import { AxiosError } from "axios";
import { useQuery, UseQueryOptions } from "react-query";

const usePageMedia = (
  args: MediaArgs & PageArgs,
  options?: Omit<
    UseQueryOptions<Page, AxiosError, Page>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<Page>(
    ["page-media", { args }],
    () => getPageMedia(args),
    options
  );
};

export default usePageMedia;

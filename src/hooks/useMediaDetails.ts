import { getMediaDetails } from "@/services/anilist";
import { Translation } from "@/types";
import { Media, MediaArgs } from "@/types/anilist";
import { AxiosError } from "axios";
import { useQuery, UseQueryOptions } from "react-query";

interface MediaWithTranslations {
  media: Media;
  translations: Translation[];
}

const useMediaDetails = (
  args: MediaArgs,
  options?: Omit<
    UseQueryOptions<MediaWithTranslations, AxiosError, MediaWithTranslations>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<MediaWithTranslations>(
    ["media-details", { args }],
    () => getMediaDetails(args),
    options
  );
};

export default useMediaDetails;

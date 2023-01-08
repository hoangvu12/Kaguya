import { getMedia } from "@/services/anilist";
import { SourceStatus } from "@/types";
import { MediaType } from "@/types/anilist";
import { useQuery } from "react-query";

const useSourceList = <T extends MediaType>(
  status: SourceStatus<T>[],
  type: T
) => {
  return useQuery(["source-list", type], () => {
    const ids = status.map((s) => s.mediaId);

    return getMedia({
      type,
      id_in: ids,
    });
  });
};

export default useSourceList;

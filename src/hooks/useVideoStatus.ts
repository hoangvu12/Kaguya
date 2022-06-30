import { getVideoStatus } from "@/services/upload";
import { useQuery } from "react-query";

const useVideoStatus = (hashid: string) => {
  return useQuery(["video-status", hashid], () => getVideoStatus(hashid), {
    enabled: !!hashid,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export default useVideoStatus;

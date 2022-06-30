import { getVideoStatus } from "@/services/upload";
import { useQuery } from "react-query";

const useVideoStatus = (hashid: string) => {
  return useQuery(["video-status", hashid], () => getVideoStatus(hashid), {
    enabled: !!hashid,
  });
};

export default useVideoStatus;

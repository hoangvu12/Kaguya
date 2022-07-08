import { createUploadService } from "@/services/upload";
import { useQuery } from "react-query";

const useVideoStatus = (fileId: string | number, hostingId: string) => {
  const { getVideoStatus } = createUploadService(hostingId);

  return useQuery(["video-status", fileId], () => getVideoStatus(fileId), {
    enabled: !!fileId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export default useVideoStatus;

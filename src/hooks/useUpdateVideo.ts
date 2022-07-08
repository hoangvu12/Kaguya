import { createUploadService, FileInfo, RemoteStatus } from "@/services/upload";
import { humanFileSize, sleep } from "@/utils";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

interface UseUpdateVideoInput {
  video: File | string;
  hostingId: string;
}

export const useUpdateVideo = (episodeSlug: string) => {
  const id = "update-video-id";
  const client = useQueryClient();

  return useMutation<FileInfo, PostgrestError, UseUpdateVideoInput>(
    async ({ video, hostingId }) => {
      const {
        getRemoteStatus,
        getVideoStatus,
        remoteUploadVideo,
        uploadVideo,
      } = createUploadService(hostingId);

      if (!video) {
        throw new Error("Video is required");
      }

      toast.loading("Uploading video...", { toastId: id });

      let uploadedVideo: FileInfo;

      if (typeof video === "string") {
        const remoteId = await remoteUploadVideo(video);

        if (!remoteId) {
          throw new Error("Upload failed");
        }

        const waitRemoteUntilDownloaded = async (): Promise<RemoteStatus> => {
          const remoteStatus = await getRemoteStatus(remoteId);

          if (remoteStatus.downloaded) {
            return remoteStatus;
          }

          if (remoteStatus.error) {
            throw new Error("Upload failed");
          }

          toast.update(id, {
            render: `Downloading video... ${
              remoteStatus.progress >= 0 && `(${remoteStatus.progress}%)`
            }`,
            type: "info",
            isLoading: true,
          });

          await sleep(2000);

          return waitRemoteUntilDownloaded();
        };

        const remoteStatus = await waitRemoteUntilDownloaded();

        uploadedVideo = await getVideoStatus(remoteStatus.fileId);
      } else if (video instanceof File) {
        uploadedVideo = await uploadVideo(video);
      }

      const { error } = await supabaseClient
        .from("kaguya_videos")
        .update({
          video: uploadedVideo,
          hostingId,
        })
        .match({ episodeId: episodeSlug });

      if (error) throw error;

      return uploadedVideo;
    },
    {
      onError: (error) => {
        toast.update(id, {
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });

        toast.error(error.message, { autoClose: 3000 });
      },
      onSuccess: () => {
        toast.update(id, {
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        toast.success("Upload successfully", { autoClose: 3000 });

        client.invalidateQueries(["uploaded-episode", episodeSlug]);
      },
    }
  );
};

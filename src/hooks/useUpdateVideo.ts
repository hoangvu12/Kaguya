import {
  FileInfo,
  getRemoteStatus,
  getVideoStatus,
  RemoteStatus,
  remoteUploadVideo,
  uploadVideo,
} from "@/services/upload";
import { sleep } from "@/utils";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

export const useUpdateVideo = (episodeSlug: string) => {
  const id = "update-video-id";
  const client = useQueryClient();

  return useMutation<FileInfo, PostgrestError, File | string>(
    async (video) => {
      if (!video) {
        throw new Error("Video is required");
      }

      toast.loading("Uploading video...", { toastId: id });

      let uploadedVideo: FileInfo;

      if (typeof video === "string") {
        const remote = await remoteUploadVideo(video);

        if (!remote.id) {
          throw new Error("Upload failed");
        }

        const waitRemoteUntilDownloaded = async (): Promise<RemoteStatus> => {
          const remoteStatus = await getRemoteStatus(remote.id);

          if (remoteStatus.status === "downloaded") {
            return remoteStatus;
          }

          if (
            remoteStatus.status !== "downloading" &&
            remoteStatus.status !== "pending"
          ) {
            throw new Error("Upload failed");
          }

          if (remoteStatus.status === "downloading") {
            toast.update(id, {
              render: `Downloading video... (${remoteStatus.data.percentage}%)`,
              isLoading: true,
            });
          }

          await sleep(2000);

          return waitRemoteUntilDownloaded();
        };

        const remoteStatus = await waitRemoteUntilDownloaded();

        uploadedVideo = await getVideoStatus(remoteStatus.data.fileId);
      } else if (video instanceof File) {
        uploadedVideo = await uploadVideo(video);
      }

      const { error } = await supabaseClient
        .from("kaguya_videos")
        .update({
          video: uploadedVideo,
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

        toast.error("Upload failed " + error.message, { autoClose: 3000 });
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

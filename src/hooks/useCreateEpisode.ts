import {
  Attachment,
  FileInfo,
  getRemoteStatus,
  getVideoStatus,
  RemoteStatus,
  remoteUploadVideo,
  uploadFile,
  uploadVideo,
  upsertEpisode,
  VideoFileResponse,
} from "@/services/upload";
import { Episode, UploadSubtitle } from "@/types";
import { humanFileSize, randomString, sleep } from "@/utils";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

interface UseCreateEpisodeArgs {
  mediaId: number;
  sourceId: string;
}

interface CreateEpisodeInput {
  video: string | File;
  subtitles: UploadSubtitle[];
  fonts: File[];
  episodeName: string;
}

interface CreateEpisodeResponse {
  video: VideoFileResponse | FileInfo;
  subtitles: Attachment[];
  fonts: Attachment[];
  episode: Episode;
}

const useCreateEpisode = (args: UseCreateEpisodeArgs) => {
  const { sourceId, mediaId } = args;

  const { user } = useUser();
  const router = useRouter();

  const id = "create-episode-id";
  const episodeId = randomString(8);

  return useMutation<CreateEpisodeResponse, Error, CreateEpisodeInput>(
    async ({ episodeName, fonts, subtitles, video }) => {
      if (!episodeName) {
        throw new Error("Episode name is required");
      }

      if (!video) {
        throw new Error("Video is required");
      }

      toast.loading("Uploading video...", {
        toastId: id,
      });

      let uploadedVideo: FileInfo;

      if (typeof video === "string") {
        const remote = await remoteUploadVideo(video);

        if (!remote.id) {
          throw new Error("Upload failed");
        }

        const waitRemoteUntilDownloaded = async (): Promise<RemoteStatus> => {
          const remoteStatus = await getRemoteStatus(remote.id);

          if (remoteStatus.status === "finished") {
            return remoteStatus;
          }

          if (
            remoteStatus.status !== "downloading" &&
            remoteStatus.status !== "new"
          ) {
            throw new Error("Upload failed");
          }

          if (remoteStatus.status === "downloading") {
            const bytesLoaded = humanFileSize(remoteStatus.bytes_loaded);
            const bytesTotal = humanFileSize(remoteStatus.bytes_total);

            toast.update(id, {
              render: `Downloading video... (${bytesLoaded} of ${bytesTotal}})`,
              type: "info",
              isLoading: true,
            });
          }

          await sleep(2000);

          return waitRemoteUntilDownloaded();
        };

        const remoteStatus = await waitRemoteUntilDownloaded();

        uploadedVideo = await getVideoStatus(remoteStatus.linkid);
      } else if (video instanceof File) {
        uploadedVideo = await uploadVideo(video);
      }

      if (!uploadedVideo) {
        throw new Error("Upload video failed");
      }

      let uploadedSubtitles: Attachment[] = [];
      let uploadedFonts: Attachment[] = [];

      if (subtitles?.length) {
        toast.update(id, {
          render: "Uploading subtitles...",
          type: "info",
          isLoading: true,
        });

        uploadedSubtitles = await uploadFile(
          subtitles.map((subtitle) => subtitle.file),
          subtitles.map((subtitle) => ({
            name: subtitle.name,
            locale: subtitle.locale,
          }))
        );
      }

      if (fonts?.length) {
        toast.update(id, {
          render: "Uploading fonts...",
          type: "info",
          isLoading: true,
        });

        uploadedFonts = await uploadFile(fonts);
      }

      if (subtitles?.length && !uploadedSubtitles.length) {
        throw new Error("Upload subtitles failed");
      }

      if (fonts?.length && !uploadedFonts.length) {
        throw new Error("Upload fonts failed");
      }

      toast.update(id, {
        render: "Creating episode...",
        type: "info",
        isLoading: true,
      });

      const upsertedEpisode = await upsertEpisode({
        episode: { name: episodeName, id: episodeId },
        mediaId,
        sourceId,
      });

      if (!upsertedEpisode) throw new Error("Upsert episode failed");

      toast.update(id, {
        render: "Uploading to database...",
        type: "info",
        isLoading: true,
      });

      const { error } = await supabaseClient.from("kaguya_videos").insert({
        video: uploadedVideo,
        subtitles: uploadedSubtitles,
        fonts: uploadedFonts,
        episodeId: upsertedEpisode.slug,
        userId: user.id,
      });

      if (error) {
        throw new Error("Upload failed " + error.message);
      }

      return {
        video: uploadedVideo,
        subtitles: uploadedSubtitles,
        fonts: uploadedFonts,
        episode: upsertedEpisode,
      };
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

        router.push(
          `/upload/anime/${mediaId}/episodes/${sourceId}-${episodeId}`
        );
      },
    }
  );
};

export default useCreateEpisode;

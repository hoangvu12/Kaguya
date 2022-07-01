import { SubtitleFile } from "@/components/features/upload/SubtitleUpload";
import { Attachment, uploadFile } from "@/services/upload";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

const useUpdateSubtitles = (episodeSlug: string) => {
  const id = "update-subtitles-id";

  return useMutation<Attachment[], Error, SubtitleFile[]>(
    async (subtitles) => {
      if (!subtitles?.length) {
        const { error } = await supabaseClient
          .from("kaguya_videos")
          .update({ subtitles: [] }, { returning: "minimal" })
          .match({ episodeId: episodeSlug });

        if (error) {
          throw new Error("Deleting subtitles failed");
        }

        return;
      }

      toast.loading("Uploading subtitles...", { toastId: id });

      const attachments = await uploadFile(
        subtitles.map((subtitle) => subtitle.file),
        subtitles.map((subtitle) => ({
          name: subtitle.name,
          locale: subtitle.locale,
        }))
      );

      toast.update(id, {
        render: "Updating subtitles...",
      });

      const { error } = await supabaseClient
        .from("kaguya_videos")
        .update({
          subtitles: attachments,
        })
        .match({ episodeId: episodeSlug });

      if (error) {
        throw new Error(error.message);
      }

      return attachments;
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
      },
    }
  );
};

export default useUpdateSubtitles;

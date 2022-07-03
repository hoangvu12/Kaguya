import { Attachment, uploadFile } from "@/services/upload";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

const useUpdateFonts = (episodeSlug: string) => {
  const id = "update-fonts-id";

  return useMutation<Attachment[], Error, File[]>(
    async (fonts) => {
      if (!fonts?.length) {
        const { error } = await supabaseClient
          .from("kaguya_videos")
          .update({ fonts: [] }, { returning: "minimal" })
          .match({ episodeId: episodeSlug });

        if (error) {
          throw new Error("Deleting fonts failed");
        }

        return;
      }

      toast.loading("Uploading fonts...", { toastId: id });

      const attachments = await uploadFile(fonts);

      toast.update(id, {
        render: "Updating fonts...",
      });

      const { error } = await supabaseClient
        .from("kaguya_videos")
        .update({
          fonts: attachments,
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

export default useUpdateFonts;

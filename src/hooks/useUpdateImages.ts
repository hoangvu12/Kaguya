import { Attachment, uploadFile } from "@/services/upload";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

const useUpdateImages = (chapterSlug: string) => {
  const id = "update-video-id";
  const client = useQueryClient();

  return useMutation<Attachment[], PostgrestError, File[]>(
    async (images) => {
      if (!images?.length) {
        throw new Error("Images is required");
      }

      toast.loading("Uploading images...", { toastId: id });

      const uploadedImages = await uploadFile(images);

      if (!uploadedImages?.length) {
        throw new Error("Upload images failed");
      }

      const { error } = await supabaseClient
        .from("kaguya_images")
        .update({
          images: uploadedImages,
        })
        .match({ chapterId: chapterSlug });

      if (error) throw error;

      return uploadedImages;
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

        client.invalidateQueries(["uploaded-chapter", chapterSlug]);
      },
    }
  );
};

export default useUpdateImages;

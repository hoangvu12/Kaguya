import { Attachment, uploadFile, upsertChapter } from "@/services/upload";
import { Chapter } from "@/types";
import { randomString } from "@/utils";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

interface UseCreateChapterArgs {
  mediaId: number;
  sourceId: string;
}

interface CreateChapterInput {
  images: File[];
  chapterName: string;
}

interface CreateChapterResponse {
  images: Attachment[];
  chapter: Chapter;
}

const useCreateChapter = (args: UseCreateChapterArgs) => {
  const { sourceId, mediaId } = args;

  const { user } = useUser();
  const router = useRouter();

  const id = "create-chapter-id";
  const chapterId = randomString(8);

  return useMutation<CreateChapterResponse, Error, CreateChapterInput>(
    async ({ chapterName, images }) => {
      if (!chapterName) {
        throw new Error("Chapter name is required");
      }

      if (!images?.length) {
        throw new Error("Images is required");
      }

      toast.loading("Creating chapter...", {
        toastId: id,
      });

      const upsertedChapter = await upsertChapter({
        chapter: { name: chapterName, id: chapterId },
        mediaId,
        sourceId,
      });

      if (!upsertedChapter) throw new Error("Upsert chapter failed");

      toast.update(id, {
        render: "Uploading images...",
        type: "info",
        isLoading: true,
      });

      const uploadedImages = await uploadFile(images);

      if (!uploadedImages?.length) {
        throw new Error("Upload images failed");
      }

      toast.update(id, {
        render: "Uploading to database...",
        type: "info",
        isLoading: true,
      });

      const { error } = await supabaseClient.from("kaguya_images").insert({
        chapterId: upsertedChapter.slug,
        images: uploadedImages,
        userId: user.id,
      });

      if (error) {
        throw new Error("Upload failed: " + error.message);
      }

      return {
        images: uploadedImages,
        chapter: upsertedChapter,
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

        supabaseClient
          .from("kaguya_chapters")
          .delete({ returning: "minimal" })
          .match({ sourceEpisodeId: chapterId });
      },
      onSuccess: () => {
        toast.update(id, {
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        toast.success("Upload successfully", { autoClose: 3000 });

        router.push(
          `/upload/manga/${mediaId}/chapters/${sourceId}-${chapterId}`
        );
      },
    }
  );
};

export default useCreateChapter;

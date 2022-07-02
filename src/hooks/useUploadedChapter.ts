import { Chapter } from "@/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";

const useUploadedChapter = (chapterSlug: string) => {
  return useQuery(["uploaded-chapter", chapterSlug], async () => {
    const { data, error } = await supabaseClient
      .from<Chapter>("kaguya_chapters")
      .select(
        `
            *,
            images:kaguya_images(*)
        `
      )
      .eq("slug", chapterSlug)
      .single();

    if (error) {
      return null;
    }

    return data;
  });
};

export default useUploadedChapter;

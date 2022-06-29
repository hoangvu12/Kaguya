import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import useUpdateSubtitles from "@/hooks/useUpdateSubtitles";
import { Attachment } from "@/services/upload";
import { createAttachmentUrl, createFileFromUrl } from "@/utils";
import React, { useState } from "react";
import { useQuery } from "react-query";
import SubtitleUpload, { SubtitleFile } from "./SubtitleUpload";

interface SubtitleUpdateProps {
  initialSubtitles?: Attachment[];
  episodeSlug: string;
}

const SubtitleUpdate: React.FC<SubtitleUpdateProps> = ({
  initialSubtitles,
  episodeSlug,
}) => {
  const [files, setFiles] = useState<SubtitleFile[]>([]);

  const { data: initialFiles, isLoading: initialFilesLoading } = useQuery<
    SubtitleFile[]
  >(["uploaded-subtitle-files", initialSubtitles], async () => {
    if (!initialSubtitles?.length) return [];

    return Promise.all<SubtitleFile>(
      initialSubtitles.map(async (file) => {
        const fileObj = await createFileFromUrl(
          createAttachmentUrl(file.url),
          file.filename
        );

        return {
          file: fileObj,
          name: file.ctx.name,
          locale: file.ctx.locale,
        };
      })
    );
  });

  const { mutate: updateSubtitles, isLoading: updateLoading } =
    useUpdateSubtitles(episodeSlug);

  const handleUpdateClick = () => {
    updateSubtitles(files);
  };

  return initialFilesLoading ? (
    <Loading />
  ) : (
    <div className="space-y-2">
      <SubtitleUpload onChange={setFiles} initialSubtitles={initialFiles} />

      <Button
        isLoading={updateLoading}
        className="ml-auto"
        primary
        onClick={handleUpdateClick}
      >
        Cập nhật
      </Button>
    </div>
  );
};

export default SubtitleUpdate;

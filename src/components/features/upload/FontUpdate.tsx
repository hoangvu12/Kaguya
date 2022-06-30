import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import useUpdateFonts from "@/hooks/useUpdateFonts";
import { Attachment } from "@/services/upload";
import { createAttachmentUrl, createFileFromUrl } from "@/utils";
import React, { useState } from "react";
import { useQuery } from "react-query";
import FontUpload from "./FontUpload";

interface FontUpdateProps {
  initialFonts?: Attachment[];
  episodeSlug: string;
}

const FontUpdate: React.FC<FontUpdateProps> = ({
  initialFonts,
  episodeSlug,
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const { data: initialFiles, isLoading: initialFilesLoading } = useQuery<
    File[]
  >(["uploaded-font-files", initialFonts], async () => {
    if (!initialFonts?.length) return [];

    return Promise.all<File>(
      initialFonts.map((file) =>
        createFileFromUrl(createAttachmentUrl(file.url), file.filename)
      )
    );
  });

  const { mutate: updateFonts, isLoading: updateLoading } =
    useUpdateFonts(episodeSlug);

  const handleUpdateClick = () => {
    updateFonts(files);
  };

  return initialFilesLoading ? (
    <Loading />
  ) : (
    <div className="space-y-2">
      <FontUpload onChange={setFiles} initialFiles={initialFiles} />

      <Button
        isLoading={false}
        className="ml-auto"
        primary
        onClick={handleUpdateClick}
      >
        Cập nhật
      </Button>
    </div>
  );
};

export default FontUpdate;

import Button from "@/components/shared/Button";
import useUpdateChapter from "@/hooks/useUpdateChapter";
import React, { useState } from "react";
import ChapterNameUpload from "./ChapterNameUpload";

interface ChapterNameUpdateProps {
  initialName?: string;
  chapterSlug: string;
}

const ChapterNameUpdate: React.FC<ChapterNameUpdateProps> = ({
  initialName,
  chapterSlug,
}) => {
  const [chapterName, setChapterName] = useState(initialName);

  const { mutate: updateChapter, isLoading } = useUpdateChapter(chapterSlug);

  const handleUpdateClick = () => {
    updateChapter({
      name: chapterName,
    });
  };

  return (
    <div className="space-y-4">
      <ChapterNameUpload
        onChange={setChapterName}
        inputProps={{ defaultValue: initialName }}
      />

      <Button
        isLoading={isLoading}
        className="ml-auto"
        primary
        onClick={handleUpdateClick}
      >
        Cập nhật
      </Button>
    </div>
  );
};

export default ChapterNameUpdate;

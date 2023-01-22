import Input, { InputProps } from "@/components/shared/Input";
import React, { useState } from "react";

interface ChapterNameUploadProps {
  onChange: (episodeName: string) => void;
  inputProps?: Omit<InputProps, "ref">;
}

const ChapterNameUpload: React.FC<ChapterNameUploadProps> = ({
  onChange,
  inputProps,
}) => {
  const [chapterName, setChapterName] = useState("");

  return (
    <div className="space-y-2">
      <label>Chapter name</label>

      <Input
        placeholder="Chapter 1"
        className="px-3 py-2"
        onChange={(e) => {
          const target = e.target as HTMLInputElement;

          setChapterName(target.value);
        }}
        onBlur={() => {
          onChange?.(chapterName);
        }}
        {...inputProps}
      />
    </div>
  );
};

export default ChapterNameUpload;

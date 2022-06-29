import Input, { InputProps } from "@/components/shared/Input";
import React, { useState } from "react";

interface EpisodeNameUploadProps {
  onChange: (episodeName: string) => void;
  inputProps?: Omit<InputProps, "ref">;
}

const EpisodeNameUpload: React.FC<EpisodeNameUploadProps> = ({
  onChange,
  inputProps,
}) => {
  const [episodeName, setEpisodeName] = useState("");

  return (
    <div className="space-y-2">
      <label>Tên tập</label>

      <Input
        placeholder="Tập 1"
        className="px-3 py-2"
        onChange={(e) => {
          const target = e.target as HTMLInputElement;

          setEpisodeName(target.value);
        }}
        onBlur={() => {
          onChange?.(episodeName);
        }}
        {...inputProps}
      />
    </div>
  );
};

export default EpisodeNameUpload;

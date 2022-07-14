import Loading from "@/components/shared/Loading";
import Select from "@/components/shared/Select";
import useHostings from "@/hooks/useHostings";
import React, { useMemo, useRef, useState } from "react";

export type VideoState = {
  video: File | string;
  hostingId: string;
};

export type VideoUploadOnChange = ({ video, hostingId }: VideoState) => void;

export interface VideoUploadProps {
  onChange?: VideoUploadOnChange;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onChange }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { data, isLoading } = useHostings();

  const [hostingId, setHostingId] = useState<string>(null);

  const handleTextAreaBlur = () => {
    onChange?.({ video: textAreaRef.current.value, hostingId });
  };

  const selectValue = useMemo(() => {
    if (isLoading) return [];

    return data.map((hosting) => ({ value: hosting.id, label: hosting.name }));
  }, [data, isLoading]);

  const handleSelectChange = ({ value }: { value: string }) => {
    setHostingId(value);

    onChange?.({ video: textAreaRef.current.value, hostingId });
  };

  const selectedHosting = useMemo(() => {
    if (isLoading) return null;
    if (!hostingId) return null;

    return data.find((hosting) => hosting.id === hostingId);
  }, [data, hostingId, isLoading]);

  return (
    <div className="relative">
      {isLoading ? (
        <Loading />
      ) : (
        // Remove file upload because the server can't handle large files

        <React.Fragment>
          <div className="flex justify-end">
            <Select
              options={selectValue}
              placeholder="Hosting"
              onChange={handleSelectChange}
            />
          </div>

          <textarea
            ref={textAreaRef}
            onBlur={handleTextAreaBlur}
            className="mt-2 p-2 w-full h-36 bg-background-900 text-white border-gray-300 border"
            placeholder={
              selectedHosting?.supportedUrlFormats?.join("\n") ||
              "Nhập url video ở đây."
            }
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default VideoUpload;

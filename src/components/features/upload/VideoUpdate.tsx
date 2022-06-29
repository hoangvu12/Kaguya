import Button from "@/components/shared/Button";
import Image from "@/components/shared/Image";
import { useUpdateVideo } from "@/hooks/useUpdateVideo";
import { FileInfo, VideoFileResponse } from "@/services/upload";
import { humanFileSize } from "@/utils";
import React, { useState } from "react";
import VideoUpload from "./VideoUpload";

interface VideoUpdateProps {
  initialVideo: FileInfo;
  episodeSlug: string;
}

const VideoUpdate: React.FC<VideoUpdateProps> = ({
  initialVideo,
  episodeSlug,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [file, setFile] = useState<File | string>(null);
  const { mutate: updateVideo, isLoading } = useUpdateVideo(episodeSlug);

  const handleStartUpdating = () => {
    setIsUpdating(true);
  };

  const handleCancelUpdating = () => {
    setIsUpdating(false);
  };

  const handleUpdate = () => {
    updateVideo(file, {
      onSuccess() {
        setIsUpdating(false);
      },
    });
  };

  return !isUpdating ? (
    <div className="flex gap-2">
      <Image
        width={150}
        height={90}
        src={`https://cdn.streamlare.com/${initialVideo.poster}`}
        alt="uploaded video"
      />

      <div className="pb-2 flex flex-col justify-between">
        <div>
          <p className="text-lg">{initialVideo.name}</p>

          <p className="text-sm text-gray-300">
            {humanFileSize(initialVideo.size)}
          </p>
        </div>

        <button
          onClick={handleStartUpdating}
          className="text-left w-max hover:text-primary-300 hover:underline"
        >
          Upload video khác
        </button>
      </div>
    </div>
  ) : (
    <div className="space-y-4">
      <VideoUpload onChange={setFile} />

      <div className="flex items-center gap-2 justify-end">
        <Button isLoading={isLoading} onClick={handleCancelUpdating} secondary>
          Hủy bỏ
        </Button>
        <Button isLoading={isLoading} onClick={handleUpdate} primary>
          Cập nhật
        </Button>
      </div>
    </div>
  );
};

export default VideoUpdate;

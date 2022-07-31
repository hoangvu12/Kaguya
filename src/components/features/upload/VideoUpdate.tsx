import Button from "@/components/shared/Button";
import Image from "@/components/shared/Image";
import { useUploadMediaInfo } from "@/contexts/UploadMediaContext";
import { useUpdateVideo } from "@/hooks/useUpdateVideo";
import { FileInfo } from "@/services/upload";
import { humanFileSize } from "@/utils";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import VideoUpload, { VideoState, VideoUploadOnChange } from "./VideoUpload";

interface VideoUpdateProps {
  initialVideo: FileInfo;
  episodeSlug: string;
}

const VideoUpdate: React.FC<VideoUpdateProps> = ({
  initialVideo,
  episodeSlug,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [videoState, setVideoState] = useState<VideoState>(null);
  const { mutate: updateVideo, isLoading } = useUpdateVideo(episodeSlug);
  const { mediaId, sourceId } = useUploadMediaInfo();

  const handleStartUpdating = () => {
    setIsUpdating(true);
  };

  const handleCancelUpdating = () => {
    setIsUpdating(false);
  };

  const handleUpdate = () => {
    updateVideo(videoState, {
      onSuccess() {
        setIsUpdating(false);
      },
    });
  };

  const handleVideoChange: VideoUploadOnChange = (state) => {
    setVideoState(state);
  };

  const episodeId = useMemo(() => episodeSlug.split("-")[1], [episodeSlug]);

  return !isUpdating ? (
    <div className="flex gap-2">
      <Image
        width={150}
        height={90}
        src={initialVideo.thumbnail || "/error.png"}
        alt="uploaded video"
        containerClassName="shrink-0"
        objectFit="cover"
        unoptimized
      />

      <div className="flex flex-col justify-between pb-2">
        <div>
          <Link href={`/anime/watch/${mediaId}/${sourceId}/${episodeId}`}>
            <a>
              <p className="break-all text-lg line-clamp-1 hover:text-primary-300 md:line-clamp-none">
                {initialVideo.name}
              </p>
            </a>
          </Link>

          <p className="text-sm text-gray-300">
            {humanFileSize(initialVideo.size)}
          </p>
        </div>

        <button
          onClick={handleStartUpdating}
          className="w-max text-left hover:text-primary-300 hover:underline"
        >
          Upload video khác
        </button>
      </div>
    </div>
  ) : (
    <div className="space-y-4">
      <VideoUpload onChange={handleVideoChange} />

      <div className="flex items-center justify-end gap-2">
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

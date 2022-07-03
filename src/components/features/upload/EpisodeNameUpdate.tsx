import Button from "@/components/shared/Button";
import { useUpdateEpisode } from "@/hooks/useUpdateEpisode";
import React, { useState } from "react";
import EpisodeNameUpload from "./EpisodeNameUpload";

interface EpisodeNameUpdateProps {
  initialName?: string;
  episodeSlug: string;
}

const EpisodeNameUpdate: React.FC<EpisodeNameUpdateProps> = ({
  initialName,
  episodeSlug,
}) => {
  const [episodeName, setEpisodeName] = useState(initialName);

  const { mutate: updateEpisode, isLoading } = useUpdateEpisode(episodeSlug);

  const handleUpdateClick = () => {
    updateEpisode({
      name: episodeName,
    });
  };

  return (
    <div className="space-y-4">
      <EpisodeNameUpload
        onChange={setEpisodeName}
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

export default EpisodeNameUpdate;

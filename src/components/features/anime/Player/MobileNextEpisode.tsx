import React from "react";
import NextIcon from "@/components/icons/NextIcon";
import MobileControlsIcon from "@/components/features/anime/Player/MobileControlsIcon";
import { useVideoProps } from "netplayer";

interface MobileNextEpisodeProps {
  onClick?: () => void;
}

const MobileNextEpisode: React.FC<MobileNextEpisodeProps> = ({ onClick }) => {
  const { i18n } = useVideoProps();

  return (
    <MobileControlsIcon
      Icon={NextIcon}
      title={i18n.controls.nextEpisode as string}
      onClick={onClick}
    />
  );
};

export default React.memo(MobileNextEpisode);

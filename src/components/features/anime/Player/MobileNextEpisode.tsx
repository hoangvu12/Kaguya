import React from "react";
import NextIcon from "@/components/icons/NextIcon";
import MobileControlsIcon from "@/components/features/anime/Player/MobileControlsIcon";

interface MobileNextEpisodeProps {
  onClick?: () => void;
}

const MobileNextEpisode: React.FC<MobileNextEpisodeProps> = ({
  children,
  onClick,
}) => {
  return (
    <MobileControlsIcon Icon={NextIcon} title="Tập tiếp theo" onClick={onClick}>
      {children}
    </MobileControlsIcon>
  );
};

export default MobileNextEpisode;

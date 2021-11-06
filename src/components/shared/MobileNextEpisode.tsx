import React from "react";
import NextIcon from "../icons/NextIcon";
import MobileControlsIcon from "./Video/MobileControlsIcon";

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

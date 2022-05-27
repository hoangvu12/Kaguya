import ControlsIcon, {
  ControlsIconProps,
} from "@/components/features/anime/Player/ControlsIcon";
import NextIcon from "@/components/icons/NextIcon";
import { ControlButton, useVideoProps } from "netplayer";
import React from "react";

const NextEpisodeButton: React.FC<Partial<ControlsIconProps>> = (props) => {
  const { i18n } = useVideoProps();

  return (
    <ControlButton tooltip={i18n.controls.nextEpisode}>
      <ControlsIcon Icon={NextIcon} {...props} />
    </ControlButton>
  );
};

export default React.memo(NextEpisodeButton);

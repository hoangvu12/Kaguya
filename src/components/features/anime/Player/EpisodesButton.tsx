import ControlsIcon from "@/components/features/anime/Player/ControlsIcon";
import EpisodesIcon from "@/components/icons/EpisodesIcon";
import { ControlButton, Popover, useVideoProps } from "netplayer";
import React from "react";
interface EpisodesButtonProps {
  className?: string;
}

const EpisodesButton: React.FC<EpisodesButtonProps> = ({
  children,
  className,
}) => {
  const { i18n } = useVideoProps();

  return (
    <Popover
      portalSelector=".netplayer-container"
      reference={
        <ControlButton className={className} tooltip={i18n.controls.episodes}>
          <ControlsIcon Icon={EpisodesIcon} />
        </ControlButton>
      }
      position="top"
      overflowElement=".netplayer-container"
    >
      {children}
    </Popover>
  );
};

export default EpisodesButton;

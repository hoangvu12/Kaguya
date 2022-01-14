import EpisodesIcon from "@/components/icons/EpisodesIcon";
import React from "react";
import Popup from "@/components/shared/Popup";
import ControlsIcon from "@/components/features/anime/Player/ControlsIcon";

interface EpisodesButtonProps {
  className?: string;
  onClick?: () => void;
}

const EpisodesButton: React.FC<EpisodesButtonProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <Popup
      portalSelector=".video-wrapper"
      reference={<ControlsIcon Icon={EpisodesIcon} onClick={onClick} />}
      referenceClassName="h-8"
      placement="top-start"
      offset={[-15, 15]}
      showArrow={false}
      type="click"
      className={className}
    >
      {children}
    </Popup>
  );
};

export default EpisodesButton;

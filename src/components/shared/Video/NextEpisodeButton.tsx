import NextIcon from "@/components/icons/NextIcon";
import React from "react";
import Popup from "../Popup";
import ControlsIcon from "./ControlsIcon";

interface NextEpisodeButtonProps {
  className?: string;
  onClick?: () => void;
}

const NextEpisodeButton: React.FC<NextEpisodeButtonProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <Popup
      portalSelector=".video-wrapper"
      reference={<ControlsIcon Icon={NextIcon} onClick={onClick} />}
      referenceClassName="h-8"
      placement="top-start"
      offset={[-15, 15]}
      showArrow={false}
      type="hover"
      className={className}
    >
      {children}
    </Popup>
  );
};

export default NextEpisodeButton;

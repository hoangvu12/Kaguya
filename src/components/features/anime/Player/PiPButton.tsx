import { ControlButton, useVideo, useVideoProps } from "netplayer";
import React from "react";
import { BsPip } from "react-icons/bs";
import { toast } from "react-toastify";
import ControlsIcon from "./ControlsIcon";

interface PiPButtonProps {
  className?: string;
}

const PiPButton: React.FC<PiPButtonProps> = ({ className }) => {
  const { i18n } = useVideoProps();
  const { videoEl } = useVideo();

  const handleClick = () => {
    if (!videoEl) {
      return toast.error("No video element found.");
    }

    // Check if picture in picture supported
    if (!document.pictureInPictureEnabled) {
      return toast.error("Picture in picture is not supported.");
    }

    // Check if video is already in picture in picture
    if (document.pictureInPictureElement) {
      return document.exitPictureInPicture();
    }

    // Enter picture in picture
    videoEl.requestPictureInPicture();
  };

  return (
    <ControlButton
      onClick={handleClick}
      className={className}
      tooltip={i18n.controls.pip}
    >
      <ControlsIcon Icon={BsPip} />
    </ControlButton>
  );
};

export default PiPButton;

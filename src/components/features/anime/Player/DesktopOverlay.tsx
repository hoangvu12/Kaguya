import { useVideo } from "@/contexts/VideoContext";
import useDevice from "@/hooks/useDevice";
import classNames from "classnames";
import React, { useCallback } from "react";

const DesktopOverlay = () => {
  const { videoEl } = useVideo();
  const { isMobile } = useDevice();

  const handleOverlayClick = useCallback(() => {
    if (videoEl.paused) {
      videoEl.play();
    } else {
      videoEl.pause();
    }
  }, [videoEl]);

  return (
    <div
      className={classNames(
        "absolute inset-0 w-full z-30",
        isMobile && "bg-black/70"
      )}
      onClick={handleOverlayClick}
    ></div>
  );
};

export default DesktopOverlay;

import { useVideo } from "@/contexts/VideoContext";
import useDevice from "@/hooks/useDevice";
import React from "react";

const Overlay: React.FC<React.HTMLProps<HTMLDivElement>> = (props) => {
  const { videoEl } = useVideo();
  const { isMobile } = useDevice();

  const handleOverlayClick = () => {
    if (!isMobile) return;

    if (videoEl.paused) {
      videoEl.play();
    } else {
      videoEl.pause();
    }
  };

  return (
    <div
      className="absolute inset-0 w-full z-30"
      style={{ height: "calc(100% - 6rem)" }}
      onClick={handleOverlayClick}
      {...props}
    >
      {props.children}
    </div>
  );
};

export default Overlay;

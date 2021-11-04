import { useVideo } from "@/contexts/VideoContext";
import useDevice from "@/hooks/useDevice";
import useEventListener from "@/hooks/useEventListener";
import classNames from "classnames";
import { HTMLMotionProps, motion } from "framer-motion";
import React, { useState } from "react";

const Overlay: React.FC<HTMLMotionProps<"div">> = (props) => {
  const { videoEl } = useVideo();
  const { isMobile } = useDevice();
  const [showOverlay, setShowOverlay] = useState(false);

  const handleOverlayClick = () => {
    if (!isMobile) return;

    if (videoEl.paused) {
      videoEl.play();
    } else {
      videoEl.pause();
    }
  };

  useEventListener("controls-shown", () => {
    setShowOverlay(true);
  });

  useEventListener("controls-hidden", () => {
    setShowOverlay(false);
  });

  return (
    <motion.div
      variants={{ show: { opacity: 1 }, hide: { opacity: 0 } }}
      animate={showOverlay ? "show" : "hide"}
      className={classNames(
        "absolute inset-0 w-full z-30",
        isMobile && "bg-black/70"
      )}
      onClick={handleOverlayClick}
      {...props}
    >
      {props.children}
    </motion.div>
  );
};

export default Overlay;

import ForwardIcon from "@/components/icons/ForwardIcon";
import PlayIcon from "@/components/icons/PlayIcon";
import RewindIcon from "@/components/icons/RewindIcon";
import { useVideo } from "@/contexts/VideoContext";
import { useVideoOptions } from "@/contexts/VideoOptionsContext";
import useDevice from "@/hooks/useDevice";
import classNames from "classnames";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import React, { useCallback } from "react";
import { AiOutlineLoading3Quarters, AiOutlinePause } from "react-icons/ai";
import ControlsIcon from "./ControlsIcon";

const variants = { show: { opacity: 1 }, hide: { opacity: 0 } };

interface OverlayProps {
  showControls: boolean;
}

const Overlay: React.FC<OverlayProps & HTMLMotionProps<"div">> = ({
  className,
  showControls,
  ...props
}) => {
  const { state, videoEl } = useVideo();
  const { isMobile } = useDevice();
  const { options } = useVideoOptions();

  const handleOverlayClick = () => {
    if (isMobile) return;

    if (videoEl.paused) {
      videoEl.play();
    } else {
      videoEl.pause();
    }
  };

  const seek = useCallback(
    (time: number) => () => {
      if (!videoEl) return;

      videoEl.currentTime = videoEl.currentTime + time;
    },
    [videoEl]
  );

  const handlePlay = () => videoEl.play();

  const handlePause = () => videoEl.pause();

  return !options.isLocked ? (
    <AnimatePresence exitBeforeEnter>
      {showControls && (
        <motion.div
          variants={variants}
          initial="hide"
          animate="show"
          exit="hide"
          className={classNames(
            "video-overlay absolute inset-0 w-full z-30 flex items-center justify-center",
            isMobile && "bg-black/70",
            className
          )}
          onClick={handleOverlayClick}
          {...props}
        >
          {isMobile && (
            <motion.div
              variants={variants}
              initial="hide"
              animate="show"
              exit="hide"
              className="flex items-center justify-between w-2/3"
            >
              <ControlsIcon
                width="3rem"
                height="3rem"
                Icon={RewindIcon}
                onClick={seek(-10)}
                whileTap={{ rotate: -20 }}
              />

              {state.buffering ? (
                <ControlsIcon
                  Icon={AiOutlineLoading3Quarters}
                  className="animate-spin"
                  width="3.5rem"
                  height="3.5rem"
                />
              ) : state.paused ? (
                <ControlsIcon
                  width="3.5rem"
                  height="3.5rem"
                  Icon={PlayIcon}
                  onClick={handlePlay}
                />
              ) : (
                <ControlsIcon
                  width="3rem"
                  height="3rem"
                  Icon={AiOutlinePause}
                  onClick={handlePause}
                />
              )}

              <ControlsIcon
                width="3rem"
                height="3rem"
                Icon={ForwardIcon}
                onClick={seek(10)}
                whileTap={{ rotate: 20 }}
              />
            </motion.div>
          )}
          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  ) : null;
};

export default Overlay;

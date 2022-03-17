import { useVideo } from "@/contexts/VideoContext";
import React, { useCallback } from "react";
import ForwardIcon from "@/components/icons/ForwardIcon";
import PlayIcon from "@/components/icons/PlayIcon";
import RewindIcon from "@/components/icons/RewindIcon";
import { AiOutlineLoading3Quarters, AiOutlinePause } from "react-icons/ai";
import ControlsIcon from "@/components/features/anime/Player/ControlsIcon";
import { motion } from "framer-motion";

const variants = { show: { opacity: 1 }, hide: { opacity: 0 } };

const MobileOverlay = () => {
  const { state, videoEl } = useVideo();

  const handleRewind = useCallback(() => {
    if (!videoEl) return;

    videoEl.currentTime = videoEl.currentTime - 10;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoEl?.src]);

  const handleForward = useCallback(() => {
    if (!videoEl) return;

    videoEl.currentTime = videoEl.currentTime + 10;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoEl?.src]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlePlay = useCallback(() => videoEl.play(), [videoEl?.src]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlePause = useCallback(() => videoEl.pause(), [videoEl?.src]);

  return (
    <motion.div
      variants={variants}
      initial="hide"
      animate="show"
      exit="hide"
      className="mobile-video-overlay w-full h-full flex items-center justify-center bg-black/70"
    >
      <div className="flex items-center justify-between w-2/3">
        <ControlsIcon
          width="3rem"
          height="3rem"
          Icon={RewindIcon}
          onClick={handleRewind}
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
          onClick={handleForward}
          whileTap={{ rotate: 20 }}
        />
      </div>
    </motion.div>
  );
};

export default MobileOverlay;

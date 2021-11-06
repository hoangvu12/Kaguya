import VolumeFullIcon from "@/components/icons/VolumeFullIcon";
import VolumeMutedIcon from "@/components/icons/VolumeMutedIcon";
import { useVideo } from "@/contexts/VideoContext";
import { motion } from "framer-motion";
import React, { useState } from "react";
import ControlsIcon from "./ControlsIcon";
import ProgressBar from "./ProgressBar";

const VolumeControl: React.FC = () => {
  const [hover, setHover] = useState(false);
  const { state, videoEl } = useVideo();

  const volume = (volume: number) => () => {
    if (!volume && volume !== 0) return videoEl.volume;

    videoEl.volume = volume;
  };

  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => setHover(false);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex items-center space-x-4"
    >
      {state.volume > 0 ? (
        <ControlsIcon Icon={VolumeFullIcon} onClick={volume(0)} />
      ) : (
        <ControlsIcon Icon={VolumeMutedIcon} onClick={volume(0.5)} />
      )}

      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: hover ? "5rem" : 0,
          opacity: hover ? 1 : 0,
        }}
      >
        <ProgressBar
          value={state.volume}
          onChange={(volume) => {
            videoEl.volume = volume;
          }}
          min={0}
          max={1}
        />
      </motion.div>
    </div>
  );
};

export default React.memo(VolumeControl);

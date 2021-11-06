import { useVideo } from "@/contexts/VideoContext";
import { parseTime } from "@/utils";
import React, { useCallback } from "react";
import ProgressBar from "./ProgressBar";

const ProgressControl = () => {
  const { state, videoEl } = useVideo();

  const handlePlay = useCallback(() => {
    videoEl.play();
  }, [videoEl]);

  const handleProgressSeek = useCallback(
    (time) => {
      videoEl.currentTime = time;

      videoEl.pause();
    },
    [videoEl]
  );

  return (
    <div className="flex items-center space-x-4">
      <ProgressBar
        value={state.currentTime}
        max={state.duration || 100}
        onSeek={handleProgressSeek}
        onChange={handlePlay}
      />

      <p className="text-gray-300">
        {parseTime(state.duration - state.currentTime || 0)}
      </p>
    </div>
  );
};

export default ProgressControl;

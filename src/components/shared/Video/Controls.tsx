import ForwardIcon from "@/components/icons/ForwardIcon";
import FullscreenIcon from "@/components/icons/FullscreenIcon";
import PlayIcon from "@/components/icons/PlayIcon";
import RewindIcon from "@/components/icons/RewindIcon";
import { useVideo } from "@/contexts/VideoContext";
import useDevice from "@/hooks/useDevice";
import useEventListener from "@/hooks/useEventListener";
import { parseTime } from "@/utils";
import React, { useCallback } from "react";
import { AiOutlineLoading3Quarters, AiOutlinePause } from "react-icons/ai";
import screenfull from "screenfull";
import ControlsIcon from "./ControlsIcon";
import ProgressBar from "./ProgressBar";
import QualitiesSelector from "./QualitiesSelector";
import VolumeControl from "./VolumeControl";

const Controls: React.FC = () => {
  const { state, videoEl } = useVideo();
  const { isMobile } = useDevice();

  const seek = useCallback(
    (time: number) => () => {
      if (!videoEl) return;

      videoEl.currentTime = videoEl.currentTime + time;
    },
    [videoEl]
  );

  const handleProgressSeek = useCallback(
    (time) => {
      videoEl.currentTime = time;

      videoEl.pause();
    },
    [videoEl]
  );

  const handlePlay = useCallback(() => {
    videoEl.play();
  }, [videoEl]);

  const handlePause = useCallback(() => {
    videoEl.pause();
  }, [videoEl]);

  const handleToggleFullscreen = useCallback(() => {
    if (!screenfull.isEnabled) return;

    const videoWrapper = document.querySelector(".video-wrapper");

    if (!screenfull.isFullscreen) {
      screenfull.request(videoWrapper);
    } else {
      screenfull.exit();
    }
  }, []);

  useEventListener("video-fullscreen", () => {
    if (!isMobile) return;

    handleToggleFullscreen();
  });

  return (
    <div className="z-40 relative w-full px-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
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

      <div className="flex items-center justify-between py-4">
        <div className="left-controls flex items-center space-x-6">
          {state.buffering ? (
            <ControlsIcon
              Icon={AiOutlineLoading3Quarters}
              className="animate-spin"
            />
          ) : state.paused ? (
            <ControlsIcon Icon={PlayIcon} onClick={handlePlay} />
          ) : (
            <ControlsIcon Icon={AiOutlinePause} onClick={handlePause} />
          )}

          <ControlsIcon
            Icon={RewindIcon}
            onClick={seek(-10)}
            whileTap={{ rotate: -20 }}
          />
          <ControlsIcon
            Icon={ForwardIcon}
            onClick={seek(10)}
            whileTap={{ rotate: 20 }}
          />

          <VolumeControl />
        </div>

        <div className="right-controls flex items-center space-x-6">
          <QualitiesSelector />

          <div className="right-controls-slot flex items-center space-x-6"></div>

          <ControlsIcon
            Icon={FullscreenIcon}
            onClick={handleToggleFullscreen}
          />
        </div>
      </div>
    </div>
  );
};

export default Controls;

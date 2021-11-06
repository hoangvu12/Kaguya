import ForwardIcon from "@/components/icons/ForwardIcon";
import FullscreenIcon from "@/components/icons/FullscreenIcon";
import PlayIcon from "@/components/icons/PlayIcon";
import RewindIcon from "@/components/icons/RewindIcon";
import { useVideo } from "@/contexts/VideoContext";
import useDevice from "@/hooks/useDevice";
import React, { useCallback } from "react";
import { AiOutlineLoading3Quarters, AiOutlinePause } from "react-icons/ai";
import screenfull from "screenfull";
import ControlsIcon from "./ControlsIcon";
import ProgressControl from "./ProgressControl";
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
      screenfull
        .request(videoWrapper)
        .then(() => {
          screen.orientation.lock("landscape").catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    } else {
      screenfull.exit();
    }
  }, []);

  return (
    <div className="z-40 relative w-full px-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
      <ProgressControl />

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

          {!isMobile && <VolumeControl />}
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

import ControlsIcon from "@/components/features/anime/Player/ControlsIcon";
import QualitiesSelector from "@/components/features/anime/Player/QualitySelector";
import ShortcutsPanel from "@/components/features/anime/Player/ShortcutsPanel";
import SkipButton from "@/components/features/anime/Player/SkipButton";
import ForwardIcon from "@/components/icons/ForwardIcon";
import FullscreenIcon from "@/components/icons/FullscreenIcon";
import PlayIcon from "@/components/icons/PlayIcon";
import RewindIcon from "@/components/icons/RewindIcon";
import { useVideo } from "@/contexts/VideoContext";
import dynamic from "next/dynamic";
import React, { useCallback } from "react";
import { AiOutlineLoading3Quarters, AiOutlinePause } from "react-icons/ai";
import screenfull from "screenfull";
import Settings from "./Settings";
import SubtitleButton from "./SubtitleButton";

const ProgressControl = dynamic(
  () => import("@/components/features/anime/Player/ProgressControl"),
  { ssr: false }
);

const VolumeControl = dynamic(
  () => import("@/components/features/anime/Player/VolumeControl"),
  { ssr: false }
);

const StateControls: React.FC = () => {
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

  const handlePlay = useCallback(() => {
    videoEl.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoEl?.src]);

  const handlePause = useCallback(() => {
    videoEl.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoEl?.src]);

  return (
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
        onClick={handleRewind}
        whileTap={{ rotate: -20 }}
      />

      <ControlsIcon
        Icon={ForwardIcon}
        onClick={handleForward}
        whileTap={{ rotate: 20 }}
      />

      <VolumeControl />
    </div>
  );
};

const NonStateControls: React.FC = () => {
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
    <div className="right-controls flex items-center space-x-6">
      <div className="right-controls-slot flex items-center space-x-6"></div>

      <SubtitleButton />
      <Settings />
      <ShortcutsPanel />
      <SkipButton />

      <ControlsIcon Icon={FullscreenIcon} onClick={handleToggleFullscreen} />
    </div>
  );
};

const Controls: React.FC = () => {
  return (
    <div className="z-40 relative w-full px-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
      <ProgressControl />

      <div className="flex items-center justify-between py-4">
        <StateControls />

        <NonStateControls />
      </div>
    </div>
  );
};

export default Controls;

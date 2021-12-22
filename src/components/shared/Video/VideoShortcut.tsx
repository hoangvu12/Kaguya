import { useVideo } from "@/contexts/VideoContext";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import screenfull from "screenfull";

interface VideoShortcutProps {
  onKeyNextEpisode: () => void;
  onKeyPreviousEpisode: () => void;
}

const VideoShortcut: React.FC<VideoShortcutProps> = ({
  onKeyNextEpisode,
  onKeyPreviousEpisode,
  children,
}) => {
  const { videoEl } = useVideo();

  const handleFullscreen = () => {
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
  };

  const handleToggleVideo = () => {
    if (videoEl?.paused) {
      videoEl?.play();
    } else {
      videoEl?.pause();
    }
  };

  const handleToggleMute = () => {
    if (videoEl?.volume === 0) {
      videoEl.volume = 1;
    } else {
      videoEl.volume = 0;
    }
  };

  const handleVideoTime = (time: number) => {
    videoEl.currentTime = time;
  };

  const handleVideoTimePercent = (percent: number) => () => {
    videoEl.currentTime = videoEl?.duration * percent;
  };

  useHotkeys("space", handleToggleVideo, [videoEl]);
  useHotkeys("k", handleToggleVideo, [videoEl]);
  useHotkeys("m", handleToggleMute, [videoEl]);
  useHotkeys("left", () => handleVideoTime(videoEl?.currentTime - 10), [
    videoEl,
  ]);
  useHotkeys("right", () => handleVideoTime(videoEl?.currentTime + 10), [
    videoEl,
  ]);
  useHotkeys("f", handleFullscreen, [videoEl]);
  useHotkeys("shift+n", onKeyNextEpisode, [videoEl]);
  useHotkeys("shift+p", onKeyPreviousEpisode, [videoEl]);

  useHotkeys("0", handleVideoTimePercent(0), [videoEl]);
  useHotkeys("1", handleVideoTimePercent(0.1), [videoEl]);
  useHotkeys("2", handleVideoTimePercent(0.2), [videoEl]);
  useHotkeys("3", handleVideoTimePercent(0.3), [videoEl]);
  useHotkeys("4", handleVideoTimePercent(0.4), [videoEl]);
  useHotkeys("5", handleVideoTimePercent(0.5), [videoEl]);
  useHotkeys("6", handleVideoTimePercent(0.6), [videoEl]);
  useHotkeys("7", handleVideoTimePercent(0.7), [videoEl]);
  useHotkeys("8", handleVideoTimePercent(0.8), [videoEl]);
  useHotkeys("9", handleVideoTimePercent(0.9), [videoEl]);

  return <>{children}</>;
};

export default VideoShortcut;

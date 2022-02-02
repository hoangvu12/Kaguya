import { SKIP_TIME } from "@/constants";
import { useHotkeys } from "react-hotkeys-hook";
import screenfull from "screenfull";

const useVideoShortcut = (videoEl: HTMLVideoElement) => {
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

  const handleVideoTime = (time: number) => () => {
    videoEl.currentTime = videoEl.currentTime + time;
  };

  const handleVideoTimePercent = (percent: number) => () => {
    videoEl.currentTime = videoEl?.duration * percent;
  };

  useHotkeys("space", handleToggleVideo, [videoEl?.duration]);
  useHotkeys("k", handleToggleVideo, [videoEl?.duration]);
  useHotkeys("m", handleToggleMute, [videoEl?.duration]);
  useHotkeys("left", handleVideoTime(-10), [videoEl?.duration]);
  useHotkeys("right", handleVideoTime(10), [videoEl?.duration]);
  useHotkeys("f", handleFullscreen, [videoEl?.duration]);
  useHotkeys("shift+right", handleVideoTime(SKIP_TIME), [videoEl?.duration]);

  useHotkeys("0", handleVideoTimePercent(0), [videoEl?.duration]);
  useHotkeys("1", handleVideoTimePercent(0.1), [videoEl?.duration]);
  useHotkeys("2", handleVideoTimePercent(0.2), [videoEl?.duration]);
  useHotkeys("3", handleVideoTimePercent(0.3), [videoEl?.duration]);
  useHotkeys("4", handleVideoTimePercent(0.4), [videoEl?.duration]);
  useHotkeys("5", handleVideoTimePercent(0.5), [videoEl?.duration]);
  useHotkeys("6", handleVideoTimePercent(0.6), [videoEl?.duration]);
  useHotkeys("7", handleVideoTimePercent(0.7), [videoEl?.duration]);
  useHotkeys("8", handleVideoTimePercent(0.8), [videoEl?.duration]);
  useHotkeys("9", handleVideoTimePercent(0.9), [videoEl?.duration]);
};

export default useVideoShortcut;

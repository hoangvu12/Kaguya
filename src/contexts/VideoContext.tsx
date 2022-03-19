import { createContext, useContext, useEffect, useState } from "react";

export interface VideoState {
  currentTime: number;
  duration: number;
  ended: boolean;
  paused: boolean;
  volume: number;
  buffering: boolean;
}

export interface ContextProps {
  state: VideoState;
  videoEl: HTMLVideoElement;
}

const VideoContext = createContext<ContextProps>(null);

export const VideoContextProvider: React.FC<{ el: HTMLVideoElement }> = ({
  children,
  el: videoEl,
}) => {
  const [state, setState] = useState<VideoState>({
    currentTime: 0,
    duration: 0,
    ended: false,
    paused: true,
    volume: 1,
    buffering: false,
  });

  useEffect(() => {
    if (!videoEl) return;

    const handleWaiting = () => {
      setState((prev) => ({
        ...prev,
        buffering: true,
      }));
    };

    const handleloadeddata = () => {
      setState((prev) => ({
        ...prev,
        currentTime: videoEl.currentTime,
        duration: videoEl.duration,
      }));
    };

    const handlePlay = () => {
      setState((prev) => ({
        ...prev,
        paused: false,
        buffering: false,
      }));
    };

    const handlePause = () => {
      setState((prev) => ({
        ...prev,
        paused: true,
      }));
    };

    const handleTimeupdate = () => {
      setState((prev) => ({
        ...prev,
        currentTime: videoEl.currentTime,
        duration: videoEl.duration,
        buffering: false,
      }));
    };

    const handleEnded = () => {
      setState((prev) => ({ ...prev, ended: true }));
    };

    const handleVolumeChange = () => {
      setState((prev) => ({ ...prev, volume: videoEl.volume }));
    };

    videoEl.addEventListener("waiting", handleWaiting);
    videoEl.addEventListener("loadeddata", handleloadeddata);
    videoEl.addEventListener("play", handlePlay);
    videoEl.addEventListener("pause", handlePause);
    videoEl.addEventListener("timeupdate", handleTimeupdate);
    videoEl.addEventListener("ended", handleEnded);
    videoEl.addEventListener("volumechange", handleVolumeChange);

    return () => {
      videoEl.removeEventListener("waiting", handleWaiting);
      videoEl.removeEventListener("loadeddata", handleloadeddata);
      videoEl.removeEventListener("play", handlePlay);
      videoEl.removeEventListener("pause", handlePause);
      videoEl.removeEventListener("timeupdate", handleTimeupdate);
      videoEl.removeEventListener("ended", handleEnded);
      videoEl.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [videoEl]);

  return (
    <VideoContext.Provider value={{ state, videoEl }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  return useContext(VideoContext);
};

export default VideoContext;

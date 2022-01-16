import { createContext, useContext, useEffect, useState } from "react";

export interface VideoState {
  currentTime: number;
  duration: number;
  ended: boolean;
  paused: boolean;
  volume: number;
  seeking: boolean;
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
    seeking: false,
    buffering: false,
  });

  useEffect(() => {
    if (!videoEl) return;

    videoEl.onwaiting = () => {
      setState((prev) => ({
        ...prev,
        buffering: true,
      }));
    };

    videoEl.onloadeddata = () => {
      setState((prev) => ({
        ...prev,
        currentTime: videoEl.currentTime,
        duration: videoEl.duration,
      }));
    };

    videoEl.onplay = () => {
      setState((prev) => ({
        ...prev,
        paused: false,
        buffering: false,
      }));
    };

    videoEl.onpause = () => {
      setState((prev) => ({
        ...prev,
        paused: true,
      }));
    };

    videoEl.ontimeupdate = () => {
      setState((prev) => ({
        ...prev,
        currentTime: videoEl.currentTime,
        duration: videoEl.duration,
        buffering: false,
      }));
    };

    videoEl.onseeking = () => {
      setState((prev) => ({
        ...prev,
        seeking: true,
      }));
    };

    videoEl.onseeked = () => {
      setState((prev) => ({
        ...prev,
        seeking: false,
      }));
    };

    videoEl.onended = () => {
      setState((prev) => ({ ...prev, ended: true }));
    };

    videoEl.onvolumechange = () => {
      setState((prev) => ({ ...prev, volume: videoEl.volume }));
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

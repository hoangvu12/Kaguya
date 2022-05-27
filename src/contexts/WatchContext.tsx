import { Anime, Episode, VideoSource } from "@/types";
import React from "react";

interface ContextProps {
  anime: Anime;
  episodes: Episode[];
  currentEpisode: Episode;
  currentEpisodeIndex: number;
  setEpisode: (episode: Episode) => void;
  sourceId: string;
  sources: VideoSource[];
}

interface WatchContextProviderProps {
  value: ContextProps;
}

const WatchContext = React.createContext<ContextProps>(null);

export const WatchContextProvider: React.FC<WatchContextProviderProps> = ({
  children,
  value,
}) => {
  return (
    <WatchContext.Provider value={value}>{children}</WatchContext.Provider>
  );
};

export const useWatchPlayer = () => {
  return React.useContext(WatchContext);
};

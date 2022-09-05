import { Episode, VideoSource } from "@/types";
import { Media } from "@/types/anilist";
import React from "react";

export interface WatchPlayerContextProps {
  anime: Media;
  episodes: Episode[];
  currentEpisode: Episode;
  currentEpisodeIndex: number;
  setEpisode: (episode: Episode) => void;
  sourceId: string;
  sources: VideoSource[];
}

interface WatchContextProviderProps {
  value: WatchPlayerContextProps;
}

const WatchContext = React.createContext<WatchPlayerContextProps>(null);

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

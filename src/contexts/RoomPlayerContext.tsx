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
  isHost: boolean;
}

interface RoomPlayerContextProviderProps {
  value: ContextProps;
}

const RoomPlayerContext = React.createContext<ContextProps>(null);

export const RoomPlayerContextProvider: React.FC<RoomPlayerContextProviderProps> =
  ({ children, value }) => {
    return (
      <RoomPlayerContext.Provider value={value}>
        {children}
      </RoomPlayerContext.Provider>
    );
  };

export const useRoomPlayer = () => {
  return React.useContext(RoomPlayerContext);
};

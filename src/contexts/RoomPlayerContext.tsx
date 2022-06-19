import { Episode, VideoSource } from "@/types";
import { Media } from "@/types/anilist";
import React from "react";

interface ContextProps {
  anime: Media;
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

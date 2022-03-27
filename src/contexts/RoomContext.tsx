import { Room } from "@/types";
import React from "react";
import { Socket } from "socket.io-client";

interface ContextProps {
  room: Room;
  socket: Socket;
}

interface ReactContextProviderProps {
  value: ContextProps;
}

const RoomContext = React.createContext<ContextProps>(null);

export const RoomContextProvider: React.FC<ReactContextProviderProps> = ({
  children,
  value,
}) => {
  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoomInfo = () => {
  return React.useContext(RoomContext);
};

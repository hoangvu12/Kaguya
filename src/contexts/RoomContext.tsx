import { BasicRoomUser, Room, RoomUser } from "@/types";
import Peer from "peerjs";
import React from "react";
import { Socket } from "socket.io-client";

interface ContextProps {
  room: Room;
  socket: Socket;
  basicRoomUser: BasicRoomUser;
  peer: Peer;
  roomUser: RoomUser;
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

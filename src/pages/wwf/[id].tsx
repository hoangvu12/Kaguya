import ChatBar from "@/components/features/wwf/RoomPage/ChatBar";
import RoomWatchPanel from "@/components/features/wwf/RoomPage/RoomWatchPanel";
import BaseLayout from "@/components/layouts/BaseLayout";
import config from "@/config";
import { useUser } from "@/contexts/AuthContext";
import { RoomContextProvider } from "@/contexts/RoomContext";
import useRoom from "@/hooks/useRoom";
import { NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { io, Socket } from "socket.io-client";

interface RoomPageProps {
  query: ParsedUrlQuery;
}

const RoomPage: NextPage<RoomPageProps> = ({ query }) => {
  const [socket, setSocket] = useState<Socket>();
  const { data, isLoading } = useRoom(Number(query.id));
  const queryClient = useQueryClient();
  const user = useUser();

  useEffect(() => {
    const socket = io(config.socketServerUrl);

    socket.emit("join", query.id, user);

    socket.on("invalidate", () => {
      queryClient.invalidateQueries(["room", Number(query.id)]);
    });

    setSocket(socket);

    return () => {
      socket?.disconnect();
    };
  }, [query.id, queryClient, user]);

  if (isLoading) return <div>...loading</div>;

  return (
    <RoomContextProvider value={{ room: data, socket }}>
      <div className="pt-20 h-screen flex overflow-y-hidden">
        <RoomWatchPanel />
        <ChatBar />
      </div>
    </RoomContextProvider>
  );
};

// @ts-ignore
RoomPage.getLayout = (children) => (
  <BaseLayout showFooter={false}>{children}</BaseLayout>
);

RoomPage.getInitialProps = ({ query }) => {
  return {
    query,
  };
};

export default RoomPage;

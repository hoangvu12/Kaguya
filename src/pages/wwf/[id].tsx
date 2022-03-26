import ChatBar from "@/components/features/wwf/RoomPage/ChatBar";
import RoomWatchPanel from "@/components/features/wwf/RoomPage/RoomWatchPanel";
import BaseLayout from "@/components/layouts/BaseLayout";
import Head from "@/components/shared/Head";
import config from "@/config";
import { useUser } from "@/contexts/AuthContext";
import { RoomContextProvider } from "@/contexts/RoomContext";
import { RoomStateContextProvider } from "@/contexts/RoomStateContext";
import useRoom from "@/hooks/useRoom";
import supabase from "@/lib/supabase";
import { Room } from "@/types";
import { getTitle } from "@/utils/data";
import { GetServerSideProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import { io, Socket } from "socket.io-client";

interface RoomPageProps {
  query: ParsedUrlQuery;
  room: Room;
}

const RoomPage: NextPage<RoomPageProps> = ({ query, room }) => {
  const [socket, setSocket] = useState<Socket>();
  const { data, isLoading } = useRoom(Number(query.id), room);
  const queryClient = useQueryClient();
  const user = useUser();

  const title = useMemo(() => data.title, [data.title]);
  const mediaTitle = useMemo(() => getTitle(data.media), [data.media]);

  useEffect(() => {
    const socket = io(config.socketServerUrl);

    socket.emit("join", query.id, user);

    socket.on("invalidate", () => {
      queryClient.invalidateQueries(["room", Number(query.id)], {
        refetchInactive: true,
      });
    });

    setSocket(socket);

    return () => {
      socket?.disconnect();
    };
  }, [query.id, queryClient, user]);

  if (isLoading || !socket) return <div>...loading</div>;

  return (
    <RoomContextProvider value={{ room: data, socket }}>
      <RoomStateContextProvider>
        <Head
          title={`${title || mediaTitle} - Kaguya`}
          description={`Cùng xem ${mediaTitle} với ${data.hostUser.user_metadata.name} tại Kaguya`}
          image={data.media.bannerImage || data.media.coverImage.extraLarge}
        />

        <div className="pt-20 h-screen flex flex-col md:flex-row overflow-y-hidden">
          <RoomWatchPanel />
          <ChatBar />
        </div>
      </RoomStateContextProvider>
    </RoomContextProvider>
  );
};

// @ts-ignore
RoomPage.getLayout = (children) => (
  <BaseLayout showFooter={false}>{children}</BaseLayout>
);

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id } = query;

  const { data } = await supabase
    .from<Room>("kaguya_rooms")
    .select(
      `
      *,
      media:mediaId(
        *,
        sourceConnections:kaguya_anime_source!mediaId(
          *,
          episodes:kaguya_episodes(
            *,
            source:kaguya_sources(id, name)
          )
        )
      ),
      episode:episodeId(*),
      users:kaguya_room_users(id),
      hostUser:hostUserId(*)
    `
    )
    .eq("id", Number(id))
    .limit(1)
    .single();

  return {
    props: {
      query,
      room: data,
    },
  };
};

export default RoomPage;

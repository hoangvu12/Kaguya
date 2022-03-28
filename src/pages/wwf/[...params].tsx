import ChatBar from "@/components/features/wwf/RoomPage/ChatBar";
import RoomWatchPanel from "@/components/features/wwf/RoomPage/RoomWatchPanel";
import BaseLayout from "@/components/layouts/BaseLayout";
import Head from "@/components/shared/Head";
import config from "@/config";
import { useUser } from "@/contexts/AuthContext";
import { RoomContextProvider } from "@/contexts/RoomContext";
import { RoomStateContextProvider } from "@/contexts/RoomStateContext";
import withRedirect from "@/hocs/withRedirect";
import useRoom from "@/hooks/useRoom";
import supabase from "@/lib/supabase";
import { Room } from "@/types";
import { vietnameseSlug } from "@/utils";
import { getTitle } from "@/utils/data";
import { GetServerSideProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import { io, Socket } from "socket.io-client";

interface RoomPageProps {
  room: Room;
}

const RoomPage: NextPage<RoomPageProps> = ({ room }) => {
  const [socket, setSocket] = useState<Socket>();
  const { data } = useRoom(room.id, room);
  const queryClient = useQueryClient();
  const user = useUser();

  const title = useMemo(() => data.title, [data.title]);
  const mediaTitle = useMemo(() => getTitle(data.media), [data.media]);

  useEffect(() => {
    const { pathname, origin } = new URL(config.socketServerUrl);

    const socket = io(origin, {
      path: `${pathname}/socket.io`,
    });

    socket.emit("join", room.id, user);

    socket.on("invalidate", () => {
      queryClient.invalidateQueries(["room", room.id], {
        refetchInactive: true,
      });
    });

    setSocket(socket);

    return () => {
      socket?.disconnect();
    };
  }, [queryClient, room.id, user]);

  return (
    <React.Fragment>
      <Head
        title={`${title || mediaTitle} - Kaguya`}
        description={`Cùng xem ${mediaTitle} với ${data.hostUser.user_metadata.name} tại Kaguya`}
        image={data.media.bannerImage || data.media.coverImage.extraLarge}
      />

      {socket ? (
        <RoomContextProvider value={{ room: data, socket }}>
          <RoomStateContextProvider>
            <div className="pt-20 h-screen flex flex-col md:flex-row overflow-y-hidden">
              <RoomWatchPanel />
              <ChatBar />
            </div>
          </RoomStateContextProvider>
        </RoomContextProvider>
      ) : (
        <div>...loading</div>
      )}
    </React.Fragment>
  );
};

// @ts-ignore
RoomPage.getLayout = (children) => (
  <BaseLayout showFooter={false}>{children}</BaseLayout>
);

export const getServerSideProps: GetServerSideProps = async ({
  params: { params },
}) => {
  const { data, error } = await supabase
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
    .eq("id", Number(params[0]))
    .limit(1)
    .single();

  if (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      room: data,
    },
  };
};

const RoomPageWithRedirect = withRedirect(RoomPage, (router, props) => {
  const { params } = router.query;
  const [id, slug] = params as string[];
  const title = getTitle(props.room.media);

  if (slug) return null;

  return {
    url: `/wwf/${id}/${vietnameseSlug(title)}`,
    options: {
      shallow: true,
    },
  };
});

// @ts-ignore
RoomPageWithRedirect.getLayout = (children) => (
  <BaseLayout showFooter={false}>{children}</BaseLayout>
);

export default RoomPageWithRedirect;

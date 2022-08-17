import GuestRegister from "@/components/features/wwf/RoomPage/GuestRegister";
import Sidebar from "@/components/features/wwf/RoomPage/Sidebar";
import BaseLayout from "@/components/layouts/BaseLayout";
import Head from "@/components/shared/Head";
import config from "@/config";
import { RoomContextProvider } from "@/contexts/RoomContext";
import { RoomStateContextProvider } from "@/contexts/RoomStateContext";
import withRedirect from "@/hocs/withRedirect";
import useRoom from "@/hooks/useRoom";
import { getMediaDetails } from "@/services/anilist";
import { mediaDefaultFields } from "@/services/anilist/queries";
import {
  AnimeSourceConnection,
  BasicRoomUser,
  ChatEvent,
  Room,
  RoomUser,
} from "@/types";
import { MediaType } from "@/types/anilist";
import { randomString, vietnameseSlug } from "@/utils";
import { getTitle } from "@/utils/data";
import {
  getUser,
  supabaseClient as supabase,
  User,
} from "@supabase/auth-helpers-nextjs";
import classNames from "classnames";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Peer } from "peerjs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import { io, Socket } from "socket.io-client";
import dynamic from "next/dynamic";

const RoomPlayer = dynamic(
  () => import("@/components/features/wwf/RoomPage/RoomPlayer"),
  { ssr: false }
);

interface RoomPageProps {
  room: Room;
  user: User;
}

const RoomPage: NextPage<RoomPageProps> = ({ room, user }) => {
  const [socket, setSocket] = useState<Socket>();
  const [peer, setPeer] = useState<Peer>();
  const { data } = useRoom(room.id, room);
  const queryClient = useQueryClient();
  const { locale } = useRouter();
  const { t } = useTranslation("wwf");

  const [basicRoomUser, setBasicRoomUser] = useState<BasicRoomUser>({
    userId: user?.id,
    avatarUrl: user?.user_metadata?.avatar_url,
    name: user?.user_metadata?.name,
    isGuest: false,
  });

  const [roomUser, setRoomUser] = useState<RoomUser>(null);

  const title = useMemo(() => data.title, [data.title]);
  const mediaTitle = useMemo(
    () => getTitle(data.media, locale),
    [data.media, locale]
  );

  const handleGuestRegister = useCallback((name: string) => {
    setBasicRoomUser({
      name,
      userId: randomString(8),
      avatarUrl: null,
      isGuest: true,
    });
  }, []);

  useEffect(() => {
    let newSocket: Socket = null;
    let newPeer: Peer = null;

    const roomQuery = ["room", room.id];

    const optimisticUpdateRoom = (update: (room: Room) => Room) => {
      queryClient.setQueryData(roomQuery, update);
    };

    const createSocket = (peerId: string) => {
      const { pathname, origin } = new URL(config.socketServerUrl);

      const socket = io(origin, {
        path: `${pathname}/socket.io`,
      });

      const roomUser = {
        ...basicRoomUser,
        id: socket.id,
        roomId: room.id,
        peerId,
        isMicMuted: true,
        isHeadphoneMuted: false,
        useVoiceChat: false,
      };

      setRoomUser(roomUser);

      socket.emit("join", room.id, peerId, roomUser);

      optimisticUpdateRoom((room) => {
        room.users.push(roomUser);

        return room;
      });

      socket.on("event", (event: ChatEvent) => {
        if (event.user.id === roomUser.id) return;

        if (event.eventType === "join") {
          optimisticUpdateRoom((room) => ({
            ...room,
            users: [...room.users, event.user],
          }));
        } else if (event.eventType === "leave") {
          optimisticUpdateRoom((room) => ({
            ...room,
            users: room.users.filter(
              (user) => user.userId !== event.user.userId
            ),
          }));
        }
      });

      socket.on("connectVoiceChat", (roomUser: RoomUser) => {
        optimisticUpdateRoom((room) => {
          const user = room.users.find((u) => u.userId === roomUser.userId);

          if (!user) return room;

          user.useVoiceChat = true;

          return room;
        });
      });

      socket.on("changeEpisode", (episode) => {
        console.log("changeEpisde", episode);

        optimisticUpdateRoom((data) => ({
          ...data,
          episode,
        }));
      });

      setSocket(socket);

      socket.on("disconnect", (reason) => {
        console.log("user disconnected", reason);

        optimisticUpdateRoom((room) => {
          room.users = room.users.filter((user) => user.id !== socket.id);

          return room;
        });

        createSocket(peerId);
      });

      socket.on("reconnect", () => {
        console.log("reconnected");
      });

      socket.on("reconnect_attempt", (attemp) => {
        console.log("reconnecting attempt", attemp);
      });

      socket.on("reconnect_error", (error: Error) => {
        console.log("reconnect error");

        console.error(error);
      });

      socket.on("reconnect_failed", () => {
        console.log("reconnect failed");
      });

      newSocket = socket;

      return socket;
    };

    const init = async () => {
      const { default: Peer } = await import("peerjs");

      if (!basicRoomUser?.name) return;

      const peer = new Peer(null, { debug: 3 });

      peer.on("open", (id) => {
        createSocket(id);
      });

      peer.on("close", () => {
        console.log("peer closed");

        peer.reconnect();
      });

      setPeer(peer);

      newPeer = peer;
    };

    init();

    return () => {
      newSocket?.off();

      newSocket?.disconnect();
      newPeer?.disconnect();
    };
  }, [queryClient, room.id, basicRoomUser]);

  return (
    <React.Fragment>
      <Head
        title={`${title || mediaTitle} - Kaguya`}
        description={t("head_description", {
          mediaTitle,
          username:
            data.hostUser.user_metadata.full_name ||
            data.hostUser.user_metadata.name,
        })}
        image={data.media.bannerImage || data.media.coverImage.extraLarge}
      />

      {!basicRoomUser?.name || !basicRoomUser?.userId ? (
        <GuestRegister onRegister={handleGuestRegister} />
      ) : socket ? (
        <RoomContextProvider
          value={{
            room: data,
            basicRoomUser: basicRoomUser,
            socket,
            peer,
            roomUser,
          }}
        >
          <RoomStateContextProvider>
            <div className="pt-20 h-screen flex flex-col md:flex-row overflow-y-hidden">
              <div
                className={classNames(
                  `shrink-0 w-full md:w-[75%] bg-background-900`
                )}
              >
                <RoomPlayer />
              </div>

              <Sidebar />
            </div>
          </RoomStateContextProvider>
        </RoomContextProvider>
      ) : (
        <div className="py-20 flex items-center justify-center w-full h-screen">
          Loading...
        </div>
      )}
    </React.Fragment>
  );
};

// @ts-ignore
RoomPage.getLayout = (children) => (
  <BaseLayout showFooter={false}>{children}</BaseLayout>
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { user } = await getUser(ctx);

    const {
      params: { params },
    } = ctx;

    const { data: room, error } = await supabase
      .from<Room>("kaguya_rooms")
      .select(
        `
        *,
        episode:episodeId(*),
        users:kaguya_room_users(*),
        hostUser:hostUserId(*)
      `
      )
      .eq("id", params[0])
      .limit(1)
      .single();

    if (error) throw error;

    const sourceConnectionPromise = supabase
      .from<AnimeSourceConnection>("kaguya_anime_source")
      .select(
        `
          episodes:kaguya_episodes(*, source:kaguya_sources(*))
        `
      )
      .eq("mediaId", room.mediaId);

    const mediaPromise = getMediaDetails(
      {
        id: room.mediaId,
        type: MediaType.Anime,
      },
      mediaDefaultFields
    );

    const [
      { data: sourceConnectionData, error: sourceConnectionError },
      media,
    ] = await Promise.all([sourceConnectionPromise, mediaPromise]);

    if (sourceConnectionError) {
      throw sourceConnectionError;
    }

    const episodes = sourceConnectionData
      .flatMap((connection) => connection.episodes)
      .filter((episode) => episode.published);

    return {
      props: {
        room: { ...room, media, episodes },
        user,
      },
    };
  } catch (err) {
    console.log(err);

    return {
      notFound: true,
    };
  }
};

const RoomPageWithRedirect = withRedirect(RoomPage, (router, props) => {
  const { params } = router.query;
  const [id, slug] = params as string[];
  const title = getTitle(props.room.media, router.locale);

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

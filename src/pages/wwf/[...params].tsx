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

  const [roomUser, setRoomUser] = useState<BasicRoomUser>({
    userId: user?.id,
    avatarUrl: user?.user_metadata?.avatar_url,
    name: user?.user_metadata?.name,
    isGuest: false,
  });

  const title = useMemo(() => data.title, [data.title]);
  const mediaTitle = useMemo(
    () => getTitle(data.media, locale),
    [data.media, locale]
  );

  const handleGuestRegister = useCallback((name: string) => {
    setRoomUser({
      name,
      userId: randomString(8),
      avatarUrl: null,
      isGuest: true,
    });
  }, []);

  useEffect(() => {
    let newSocket: Socket = null;
    let newPeer: Peer = null;

    const createSocket = (peerId: string) => {
      const { pathname, origin } = new URL(config.socketServerUrl);

      const socket = io(origin, {
        path: `${pathname}/socket.io`,
      });

      const roomQuery = ["room", room.id];

      socket.emit("join", room.id, peerId, roomUser);

      socket.on("invalidate", () => {
        queryClient.invalidateQueries(roomQuery, {
          refetchInactive: true,
        });
      });

      socket.on("event", (event: ChatEvent) => {
        if (event.eventType === "join") {
          queryClient.setQueryData<Room>(roomQuery, (room) => ({
            ...room,
            users: [...room.users, event.user],
          }));
        } else if (event.eventType === "leave") {
          queryClient.setQueryData<Room>(roomQuery, (room) => ({
            ...room,
            users: room.users.filter(
              (user) => user.userId !== event.user.userId
            ),
          }));
        }
      });

      socket.on("connectVoiceChat", (roomUser: RoomUser) => {
        queryClient.setQueryData<Room>(roomQuery, (room) => {
          const user = room.users.find((u) => u.userId === roomUser.userId);

          if (!user) return room;

          user.useVoiceChat = true;

          return room;
        });
      });

      socket.on("changeEpisode", (episode) => {
        queryClient.setQueryData<Room>(roomQuery, (data) => ({
          ...data,
          episode,
        }));
      });

      setSocket(socket);

      socket.on("disconnect", () => {
        console.log("user disconnected");

        createSocket(peerId);
      });

      newSocket = socket;

      return socket;
    };

    const init = async () => {
      const { default: Peer } = await import("peerjs");

      if (!roomUser?.name) return;

      const peer = new Peer(null, { debug: 3 });

      peer.on("open", (id) => {
        createSocket(id);
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
  }, [queryClient, room.id, roomUser]);

  return (
    <React.Fragment>
      <Head
        title={`${title || mediaTitle} - Kaguya`}
        description={t("head_description", {
          mediaTitle,
          username: data.hostUser.user_metadata.name,
        })}
        image={data.media.bannerImage || data.media.coverImage.extraLarge}
      />

      {!roomUser?.name || !roomUser?.userId ? (
        <GuestRegister onRegister={handleGuestRegister} />
      ) : socket ? (
        <RoomContextProvider
          value={{
            room: data,
            basicRoomUser: roomUser,
            socket,
            peer,
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

import ChatBar from "@/components/features/wwf/RoomPage/ChatBar";
import RoomWatchPanel from "@/components/features/wwf/RoomPage/RoomWatchPanel";
import BaseLayout from "@/components/layouts/BaseLayout";
import Head from "@/components/shared/Head";
import config from "@/config";
import { useUser } from "@supabase/auth-helpers-react";
import { RoomContextProvider } from "@/contexts/RoomContext";
import { RoomStateContextProvider } from "@/contexts/RoomStateContext";
import withRedirect from "@/hocs/withRedirect";
import useRoom from "@/hooks/useRoom";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { getMediaDetails } from "@/services/anilist";
import { mediaDefaultFields } from "@/services/anilist/queries";
import { AnimeSourceConnection, Room } from "@/types";
import { MediaType } from "@/types/anilist";
import { vietnameseSlug } from "@/utils";
import { getTitle } from "@/utils/data";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
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
  const { user } = useUser();
  const { locale } = useRouter();
  const { t } = useTranslation("wwf");

  const title = useMemo(() => data.title, [data.title]);
  const mediaTitle = useMemo(
    () => getTitle(data.media, locale),
    [data.media, locale]
  );

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
        description={t("head_description", {
          mediaTitle,
          username: data.hostUser.user_metadata.name,
        })}
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
  try {
    const { data: room, error } = await supabase
      .from<Room>("kaguya_rooms")
      .select(
        `
        *,
        episode:episodeId(*),
        users:kaguya_room_users(id),
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
          episodes:kaguya_episodes(*, source:kaguya_sources(id, name, locales))
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

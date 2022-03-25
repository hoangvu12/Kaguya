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

const room = {
  id: 1,
  created_at: "2022-03-24T03:29:10+00:00",
  updated_at: "2022-03-24T03:29:10+00:00",
  hostUserId: "3bc03d82-0a22-48d9-b2ec-4e8833b73aa5",
  mediaId: 113717,
  episodeId: "af-297042",
  media: {
    id: 113717,
    created_at: "2022-02-14T10:42:40.335648+00:00",
    updated_at: "2022-03-18T17:36:12.711896+00:00",
    idMal: 40834,
    title: {
      romaji: "Ousama Ranking",
      english: "Ranking of Kings",
      native: "王様ランキング",
      userPreferred: "Ousama Ranking",
    },
    coverImage: {
      color: "#5daee4",
      large:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113717-WGzAyw27y9sI.jpg",
      medium:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx113717-WGzAyw27y9sI.jpg",
      extraLarge:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113717-WGzAyw27y9sI.jpg",
    },
    startDate: {
      day: 15,
      year: 2021,
      month: 10,
    },
    trending: 297,
    popularity: 66184,
    favourites: 2987,
    bannerImage:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/113717-XFiGSPtNJQWv.jpg",
    season: "FALL",
    seasonYear: 2021,
    format: "TV",
    status: "RELEASING",
    totalEpisodes: 23,
    tags: [
      "Disability",
      "Coming of Age",
      "Fairy Tale",
      "Conspiracy",
      "Language Barrier",
      "Male Protagonist",
      "Ensemble Cast",
      "Bullying",
      "Swordplay",
      "Magic",
      "Achronological Order",
      "War",
      "Assassins",
      "Demons",
      "Gore",
      "Slavery",
      "Amputation",
      "Cannibalism",
      "Tsundere",
      "CGI",
      "Suicide",
      "Age Gap",
    ],
    episodeUpdatedAt: "2022-03-18T17:36:12.711896",
    description:
      'Phim xoay quanh Bojji, một hoàng tử bị điếc, bất lực, thậm chí không thể sử dụng thanh kiếm của trẻ em. Là con trai đầu lòng, anh phấn đấu hết mình và ước mơ trở thành vị vua vĩ đại nhất thế giới. Tuy nhiên, mọi người đồn thổi về anh sau lưng anh là "một hoàng tử chẳng ra gì" và "không thể nào anh có thể làm vua được." Bojji có thể kết bạn đầu tiên của mình, "Kage" (bóng tối) —một cái bóng theo nghĩa đen trên mặt đất, người bằng cách nào đó hiểu rõ Bojji. (Kage là một người sống sót trong gia tộc sát thủ Kage đã bị xóa sổ. Không còn là một kẻ giết người, Kage giờ đây kiếm sống bằng cách ăn trộm.) với cuộc gặp gỡ định mệnh của mình với Kage.',
    vietnameseTitle: "Bảng Xếp Hạng Quốc Vương",
    isAdult: false,
    synonyms: ["King Ranking", "อันดับพระราชา"],
    countryOfOrigin: "JP",
    averageScore: 86,
    genres: ["Adventure", "Fantasy"],
    duration: 23,
    trailer: "KcR8QyzF4yQ",
  },
  episode: {
    id: 810511,
    created_at: "2022-02-20T03:42:45.668559+00:00",
    updated_at: "2022-03-10T10:37:13.274607+00:00",
    name: "14",
    sourceId: "af",
    sourceEpisodeId: "297042",
    sourceMediaId: "18727",
    slug: "af-297042",
    sourceConnectionId: "18727-af",
  },
  users: [],
  hostUser: {
    id: "3bc03d82-0a22-48d9-b2ec-4e8833b73aa5",
    created_at: "2021-11-07T13:48:40.425+00:00",
    updated_at: "2021-11-07T13:48:40.425+00:00",
    user_metadata: {
      iss: "https://graph.facebook.com/me?fields=email,first_name,last_name,name,picture",
      sub: "666715354321256",
      name: "Vũ Nguyễn",
      slug: "Nguyễn Vũ",
      email: "hggaming78@gmail.com",
      picture:
        "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=666715354321256&height=50&width=50&ext=1638884920&hash=AeT_A8rRsJbkRWaDarU",
      nickname: "Nguyễn Vũ",
      full_name: "Vũ Nguyễn",
      avatar_url:
        "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=666715354321256&height=50&width=50&ext=1638884920&hash=AeT_A8rRsJbkRWaDarU",
      provider_id: "666715354321256",
      email_verified: true,
    },
    app_metadata: {},
    raw_app_meta_data: {
      provider: "facebook",
      providers: ["facebook"],
    },
    email: "hggaming78@gmail.com",
    aud: "authenticated",
    role: "authenticated",
    auth_role: "admin",
  },
};

const RoomPage: NextPage<RoomPageProps> = ({ query }) => {
  const [socket, setSocket] = useState<Socket>();
  const { data, isLoading } = useRoom(Number(query.id));
  const queryClient = useQueryClient();
  const user = useUser();

  useEffect(() => {
    const socket = io(config.socketServerUrl);

    socket.emit("join", query.id, user);

    socket.on("invalidate", () => {
      console.log("invalidate");
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

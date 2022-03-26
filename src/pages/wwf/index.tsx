import Head from "@/components/shared/Head";
import List from "@/components/shared/List";
import RoomCard from "@/components/shared/RoomCard";
import Section from "@/components/shared/Section";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import RoomListSkeleton from "@/components/skeletons/RoomListSkeleton";
import { useUser } from "@/contexts/AuthContext";
import useRooms from "@/hooks/useRooms";
import { Room } from "@/types";
import React from "react";

const media = {
  id: 16498,
  created_at: "2022-02-14T10:42:40.335648+00:00",
  updated_at: "2022-03-17T03:23:07.313728+00:00",
  idMal: 16498,
  title: {
    romaji: "Shingeki no Kyojin",
    english: "Attack on Titan",
    native: "進撃の巨人",
    userPreferred: "Shingeki no Kyojin",
  },
  coverImage: {
    color: "#e4a10d",
    large:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16498-m5ZMNtFioc7j.png",
    medium:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx16498-m5ZMNtFioc7j.png",
    extraLarge:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-m5ZMNtFioc7j.png",
  },
  startDate: {
    day: 7,
    year: 2013,
    month: 4,
  },
  trending: 26,
  popularity: 550561,
  favourites: 49874,
  bannerImage:
    "https://s4.anilist.co/file/anilistcdn/media/anime/banner/16498-8jpFCOcDmneX.jpg",
  season: "SPRING",
  seasonYear: 2013,
  format: "TV",
  status: "FINISHED",
  totalEpisodes: 25,
  tags: [
    "Survival",
    "Kaiju",
    "Military",
    "Tragedy",
    "Shapeshifting",
    "Vore",
    "Post-Apocalyptic",
    "Swordplay",
    "Super Power",
    "Memory Manipulation",
    "Gore",
    "Ensemble Cast",
    "Male Protagonist",
    "Cosmic Horror",
    "Espionage",
    "Foreign",
    "Time Skip",
    "Dystopian",
    "Shounen",
    "Amnesia",
    "Cannibalism",
    "Dissociative Identities",
    "Kuudere",
    "Coming of Age",
    "CGI",
    "Adoption",
  ],
  episodeUpdatedAt: "2022-02-14T10:50:42.702564",
  description:
    'Phim miêu tả cuộc chiến giữa loài người và những sinh vật khổng lồ đang thống trị thế giới bên ngoài nơi con người sinh sống, được bao quanh bởi những bức tường thành cao lớn. Titan - 1 loài vật giống người, cực kì to lớn, nhưng óc như óc lợn, thích ăn thịt người như là thú vui. Còn con người thì hoàn toàn lép vế và phải cố thủ trong ba bức tường kiên cố, nhờ vậy mà họ đã có được 100 năm yên bình. Nhưng 100 năm sau, bọn Titan cuối cùng cũng vào được và cướp đi sinh mạng người mẹ thân yêu của Eren, một cậu bé "bình thường" như bao người khác. Thế là trong lòng cậu nảy sinh thủ hận và cậu đã quyết định gia nhập Đội Trinh Sát để trả thù cho mẹ mình. Câu chuyện về 3 người bạn thân Eren, Mikasa và Armin sẽ như thế nào, liệu họ và những cư dân còn sót lại sẽ tìm ra bí mật nào đó để đánh bại lũ Titan khổng lồ ? Bộ phim có thêm 7 nhân vật mới so với cốt truyện. Trong đó, nhân vật Shikimaru do Hasegawa thủ vai với mệnh danh “chiến binh mạnh nhất nhân loại” nắm giữ vai trò quan trọng trong phim. Phim bao gồm 2 phần Live-action được chuyển thể từ manga và anime cùng tên. Phần đầu phát hành ngày 1/8/2015 mang tên gốc Shingeki no Kyojin/Attack on Titan, và phần 2 phát hành vào 19/9/2015 mang tên Shingeki no Kyojin/Attack on Titan End of the World.',
  vietnameseTitle: "Tấn Công Người Khổng Lồ",
  isAdult: false,
  synonyms: [
    "SnK",
    "AoT",
    "Ataque a los Titanes",
    "Ataque dos Titãs",
    "L'Attacco dei Giganti",
    "מתקפת הטיטאנים",
    "进击的巨人",
    "L’Attaque des Titans",
    "الهجوم على العمالقة",
    "ผ่าพิภพไททัน",
    "Atak Tytanów",
    "حمله به تایتان",
  ],
  countryOfOrigin: "JP",
  averageScore: 85,
  genres: ["Action", "Drama", "Fantasy", "Mystery"],
  duration: 24,
  trailer: "KKzmOh4SuBc",
};

const WatchWithFriendPage = () => {
  const { data, isLoading } = useRooms();

  console.log(data);

  return (
    <Section className="py-20">
      <Head title="Xem cùng bạn bè - Kaguya" />

      <h1 className="text-4xl font-semibold text-center md:text-left mb-8">
        Phòng đang hoạt động
      </h1>

      {isLoading ? (
        <RoomListSkeleton />
      ) : (
        <List
          className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 !gap-x-4 !gap-y-8"
          data={data}
          noListMessage="Không có phòng nào đang hoạt động"
        >
          {(room) => <RoomCard room={room} />}
        </List>
      )}
    </Section>
  );
};

export default WatchWithFriendPage;

import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import List from "@/components/shared/List";
import RoomCard from "@/components/shared/RoomCard";
import Section from "@/components/shared/Section";
import RoomListSkeleton from "@/components/skeletons/RoomListSkeleton";
import useRooms from "@/hooks/useRooms";
import Link from "next/link";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

const WatchWithFriendPage = () => {
  const { data, isLoading } = useRooms();

  return (
    <Section className="py-20">
      <Head title="Xem cùng bạn bè - Kaguya" />

      <div className="flex flex-col md:flex-row items-center md:justify-between mb-8 gap-4">
        <h1 className="text-4xl font-semibold text-center md:text-left">
          Phòng đang hoạt động
        </h1>

        <Link href="/wwf/create">
          <a>
            <Button primary LeftIcon={AiOutlinePlus}>
              <p>Tạo phòng</p>
            </Button>
          </a>
        </Link>
      </div>

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

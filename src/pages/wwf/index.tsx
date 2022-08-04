import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import List from "@/components/shared/List";
import RoomCard from "@/components/shared/RoomCard";
import Section from "@/components/shared/Section";
import RoomListSkeleton from "@/components/skeletons/RoomListSkeleton";
import useRooms from "@/hooks/useRooms";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

const WatchWithFriendPage = () => {
  const { data, isLoading } = useRooms();
  const { t } = useTranslation("wwf");

  return (
    <Section className="py-20">
      <Head
        title={t("browse_page_title")}
        description={t("browse_page_description")}
      />

      <div className="mb-8 flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <h1 className="text-center text-4xl font-semibold md:text-left">
          {t("active_rooms")}
        </h1>

        <Link href="/wwf/create">
          <a>
            <Button primary LeftIcon={AiOutlinePlus}>
              <p>{t("create_room")}</p>
            </Button>
          </a>
        </Link>
      </div>

      {isLoading ? (
        <RoomListSkeleton />
      ) : (
        <List
          className="grid-cols-1 !gap-x-4 !gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          data={data}
          noListMessage={t("no_active_rooms")}
        >
          {(room) => <RoomCard room={room} />}
        </List>
      )}
    </Section>
  );
};

export default WatchWithFriendPage;

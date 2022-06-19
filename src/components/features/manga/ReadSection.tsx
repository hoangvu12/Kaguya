import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useRead from "@/hooks/useRead";
import React from "react";
import CardSwiper from "@/components/shared/CardSwiper";
import Section from "@/components/shared/Section";
import { useTranslation } from "next-i18next";

const ReadSection = () => {
  const { data, isLoading, isError } = useRead();
  const { t } = useTranslation("manga_home");

  if (isLoading) {
    return <ListSwiperSkeleton />;
  }

  if (!data?.length || isError) {
    return null;
  }

  return (
    <Section title={t("recently_read")}>
      <CardSwiper data={data.map((read) => read.media)} />
    </Section>
  );
};

export default ReadSection;

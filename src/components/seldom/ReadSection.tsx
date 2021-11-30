import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useRead from "@/hooks/useRead";
import React from "react";
import CardSwiper from "../shared/CardSwiper";
import Section from "./Section";

const ReadSection = () => {
  const { data, isLoading, isError } = useRead();

  if (isLoading) {
    return <ListSwiperSkeleton />;
  }

  if (!data?.length || isError) {
    return null;
  }

  return (
    <Section title="Đọc gần đây">
      <CardSwiper data={data.map((read) => read.manga)} type="manga" />
    </Section>
  );
};

export default ReadSection;

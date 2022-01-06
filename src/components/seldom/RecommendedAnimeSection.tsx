import useRecommendedList from "@/hooks/useRecommendedList";
import { Watched } from "@/types";
import React from "react";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import CardSwiper from "@/components/shared/CardSwiper";
import Section from "./Section";

const composeData = (data: Watched) => {
  const title =
    typeof data.anime?.title === "string"
      ? data.anime?.title
      : data.anime?.title.user_preferred;

  return {
    title: data.anime?.vietnamese_title || title,
    list: data.anime?.recommendations?.map(({ anime }) => anime),
  };
};

const RecommendedAnimeSection = () => {
  const { data, isError, isLoading } = useRecommendedList();

  if (isLoading) {
    return <ListSwiperSkeleton />;
  }

  if (!data || isError) {
    return null;
  }

  const composedData = composeData(data);

  return (
    <Section title={`Vì bạn đã xem ${composedData.title}`}>
      <CardSwiper data={composedData.list} type="anime" />
    </Section>
  );
};

export default React.memo(RecommendedAnimeSection);

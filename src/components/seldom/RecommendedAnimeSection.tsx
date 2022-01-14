import useRecommendedList from "@/hooks/useRecommendedList";
import { Watched } from "@/types";
import React from "react";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import CardSwiper from "@/components/shared/CardSwiper";
import Section from "./Section";
import { getTitle } from "@/utils/data";

const composeData = (data: Watched) => {
  const title = getTitle(data.anime);

  return {
    title,
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

  return composedData ? (
    <Section title={`Vì bạn đã xem ${composedData.title}`}>
      <CardSwiper data={composedData.list} type="anime" />
    </Section>
  ) : null;
};

export default React.memo(RecommendedAnimeSection);

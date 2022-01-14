import CardSwiper from "@/components/shared/CardSwiper";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useMangaRecommendedList from "@/hooks/useMangaRecommendedList";
import { Read } from "@/types";
import { getTitle } from "@/utils/data";
import React from "react";
import Section from "./Section";

const composeData = (data: Read) => {
  const title = getTitle(data.manga);

  return {
    title,
    list: data.manga?.recommendations?.map(({ manga }) => manga),
  };
};

const RecommendedMangaSection = () => {
  const { data, isError, isLoading } = useMangaRecommendedList();

  if (isLoading) {
    return <ListSwiperSkeleton />;
  }

  if (!data || isError) {
    return null;
  }

  const composedData = composeData(data);

  return composedData ? (
    <Section title={`Vì bạn đã xem ${composedData.title}`}>
      <CardSwiper data={composedData.list} type="manga" />
    </Section>
  ) : null;
};

export default React.memo(RecommendedMangaSection);

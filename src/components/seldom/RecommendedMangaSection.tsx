import CardSwiper from "@/components/shared/CardSwiper";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useMangaRecommendedList from "@/hooks/useMangaRecommendedList";
import { Read } from "@/types";
import { getTitle } from "@/utils/data";
import React from "react";
import Section from "./Section";

const composeData = (data: Read) => {
  const title = getTitle(data.manga);

  const recommendations = data.manga?.recommendations?.map(
    ({ manga }) => manga
  );

  return {
    title,
    list: recommendations,
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

  return composedData?.list?.length ? (
    <Section title={`Vì bạn đã đọc "${composedData.title}"`}>
      <CardSwiper data={composedData.list} type="manga" />
    </Section>
  ) : null;
};

export default React.memo(RecommendedMangaSection);

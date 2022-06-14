import CardSwiper from "@/components/shared/CardSwiper";
import Section from "@/components/shared/Section";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useAnimeRecommendedList from "@/hooks/useAnimeRecommendedList";
import { Watched } from "@/types";
import { getTitle } from "@/utils/data";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";

const composeData = (data: Watched, locale?: string) => {
  const title = getTitle(data.media, locale);

  const recommendations = data.media?.recommendations?.nodes.map((node) => {
    return node.mediaRecommendation;
  });

  return {
    title,
    list: recommendations,
  };
};

const RecommendedAnimeSection = () => {
  const { data, isError, isLoading } = useAnimeRecommendedList();
  const { t } = useTranslation("anime_home");
  const { locale } = useRouter();

  if (isLoading) {
    return <ListSwiperSkeleton />;
  }

  if (!data || isError) {
    return null;
  }

  const composedData = composeData(data, locale);

  return composedData?.list?.length ? (
    <Section title={`${t("because_you_watched")} "${composedData.title}"`}>
      <CardSwiper data={composedData.list} />
    </Section>
  ) : null;
};

export default React.memo(RecommendedAnimeSection);

import CardSwiper from "@/components/shared/CardSwiper";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import Section from "@/components/shared//Section";
import useMangaRecommendedList from "@/hooks/useMangaRecommendedList";
import { Read } from "@/types";
import { getTitle } from "@/utils/data";
import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const composeData = (data: Read, locale?: string) => {
  const title = getTitle(data.media, locale);

  const recommendations = data.media?.recommendations?.nodes.map((node) => {
    return node.mediaRecommendation;
  });

  return {
    title,
    list: recommendations,
  };
};

const RecommendedMangaSection = () => {
  const { data, isError, isLoading } = useMangaRecommendedList();
  const { locale } = useRouter();
  const { t } = useTranslation("manga_home");

  if (isLoading) {
    return <ListSwiperSkeleton />;
  }

  if (!data || isError) {
    return null;
  }

  const composedData = composeData(data, locale);

  return composedData?.list?.length ? (
    <Section title={`${t("because_you_read")} "${composedData.title}"`}>
      <CardSwiper data={composedData.list} />
    </Section>
  ) : null;
};

export default React.memo(RecommendedMangaSection);

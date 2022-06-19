import ReadSection from "@/components/features/manga/ReadSection";
import RecommendedMangaSection from "@/components/features/manga/RecommendedMangaSection";
import CardSwiper from "@/components/shared/CardSwiper";
import ClientOnly from "@/components/shared/ClientOnly";
import ColumnSection from "@/components/shared/ColumnSection";
import GenreSwiper from "@/components/shared/GenreSwiper";
import Head from "@/components/shared/Head";
import HomeBanner from "@/components/shared/HomeBanner";
import NewestComments from "@/components/shared/NewestComments";
import Section from "@/components/shared/Section";
import ShouldWatch from "@/components/shared/ShouldWatch";
import { REVALIDATE_TIME } from "@/constants";
import useDevice from "@/hooks/useDevice";
import { getMedia, getRecommendations } from "@/services/anilist";
import { Media, MediaSort, MediaType } from "@/types/anilist";
import { prodSleep, randomElement } from "@/utils";
import classNames from "classnames";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import React from "react";

interface HomeProps {
  trendingManga: Media[];
  randomManga: Media;
  popularManga: Media[];
  favouriteManga: Media[];
  recentlyUpdatedManga: Media[];
}

const Home: NextPage<HomeProps> = ({
  trendingManga,
  randomManga,
  recentlyUpdatedManga,
  favouriteManga,
  popularManga,
}) => {
  const { isDesktop } = useDevice();
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Head />

      <ClientOnly>
        <div className="pb-8">
          <HomeBanner type={MediaType.Manga} data={trendingManga} />

          <div className="space-y-8">
            <ReadSection />
            <RecommendedMangaSection />

            <Section className="flex flex-col md:flex-row items-center md:space-between space-y-4 space-x-0 md:space-y-0 md:space-x-4">
              <ColumnSection
                title={t("common:most_popular")}
                type={MediaType.Manga}
                data={popularManga}
                viewMoreHref="/browse?sort=popularity&type=manga"
              />
              <ColumnSection
                title={t("common:most_favourite")}
                type={MediaType.Manga}
                data={favouriteManga}
                viewMoreHref="/browse?sort=favourites&type=manga"
              />
            </Section>

            <NewestComments type={MediaType.Manga} />

            <Section title={t("common:newly_added")}>
              <CardSwiper data={recentlyUpdatedManga} />
            </Section>

            <div
              className={classNames(
                "flex gap-8",
                isDesktop ? "flex-row" : "flex-col"
              )}
            >
              <Section
                title={t("manga_home:should_read_today")}
                className="w-full md:w-[80%] md:!pr-0"
              >
                <ShouldWatch type={MediaType.Manga} data={randomManga} />
              </Section>
              <Section
                title={t("common:genres")}
                className="w-full md:w-[20%] md:!pl-0"
              >
                <GenreSwiper className="md:h-[500px]" />
              </Section>
            </div>
          </div>
        </div>
      </ClientOnly>
    </React.Fragment>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  await prodSleep(2500);

  const trendingManga = await getMedia({
    type: MediaType.Manga,
    sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
  });

  await prodSleep(2500);

  const popularManga = await getMedia({
    type: MediaType.Manga,
    sort: [MediaSort.Popularity_desc],
    perPage: 5,
  });

  await prodSleep(2500);

  const favouriteManga = await getMedia({
    type: MediaType.Manga,
    sort: [MediaSort.Favourites_desc],
    perPage: 5,
  });

  await prodSleep(2500);

  const recentlyUpdatedManga = await getMedia({
    type: MediaType.Manga,
    sort: [MediaSort.Updated_at_desc],
    isAdult: false,
  });

  const recommendationsManga = await getRecommendations({
    mediaId: randomElement(trendingManga).id,
  });

  await prodSleep(2500);

  const randomManga = randomElement(recommendationsManga).media;

  return {
    props: {
      trendingManga,
      recentlyUpdatedManga,
      randomManga,
      popularManga,
      favouriteManga,
    },
    revalidate: REVALIDATE_TIME,
  };
};

export default Home;

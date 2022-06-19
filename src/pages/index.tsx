import AnimeScheduling from "@/components/features/anime/AnimeScheduling";
import RecommendedAnimeSection from "@/components/features/anime/RecommendedAnimeSection";
import WatchedSection from "@/components/features/anime/WatchedSection";
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
import dayjs from "@/lib/dayjs";
import {
  getAllAiringSchedules,
  getMedia,
  getRecommendations,
} from "@/services/anilist";
import { AiringSchedule, Media, MediaSort, MediaType } from "@/types/anilist";
import { getSeason, prodSleep, randomElement } from "@/utils";
import classNames from "classnames";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";

interface HomeProps {
  trendingAnime: Media[];
  randomAnime: Media;
  recentlyUpdated: Media[];
  schedulesAnime: AiringSchedule[];
  popularSeason: Media[];
  popularAllTime: Media[];
  favouriteSeason: Media[];
  favouriteAllTime: Media[];
}

const Home: NextPage<HomeProps> = ({
  trendingAnime,
  randomAnime,
  recentlyUpdated,
  schedulesAnime,
  favouriteAllTime,
  favouriteSeason,
  popularAllTime,
  popularSeason,
}) => {
  const currentSeason = useMemo(getSeason, []);
  const { isDesktop } = useDevice();
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Head />

      <ClientOnly>
        <div className="pb-8">
          <HomeBanner type={MediaType.Anime} data={trendingAnime} />

          <div className="space-y-8">
            <WatchedSection />
            <RecommendedAnimeSection />

            <Section className="flex flex-col md:flex-row items-center md:space-between space-y-4 space-x-0 md:space-y-0 md:space-x-4">
              <ColumnSection
                title={t("most_popular_season", { ns: "common" })}
                type={MediaType.Anime}
                data={popularSeason}
                viewMoreHref={`/browse?sort=popularity&type=anime&season=${currentSeason.season}&seasonYear=${currentSeason.year}`}
              />
              <ColumnSection
                title={t("most_popular", { ns: "common" })}
                type={MediaType.Anime}
                data={popularAllTime}
                viewMoreHref="/browse?sort=popularity&type=anime"
              />
              <ColumnSection
                title={t("most_favourite_season", { ns: "common" })}
                type={MediaType.Anime}
                data={favouriteSeason}
                viewMoreHref={`/browse?sort=favourites&type=anime&season=${currentSeason.season}&seasonYear=${currentSeason.year}`}
              />
              <ColumnSection
                title={t("most_favourite", { ns: "common" })}
                type={MediaType.Anime}
                data={favouriteAllTime}
                viewMoreHref="/browse?sort=favourites&type=anime"
              />
            </Section>

            <NewestComments type={MediaType.Anime} />

            <Section title={t("newly_added", { ns: "common" })}>
              <CardSwiper data={recentlyUpdated} />
            </Section>

            <div
              className={classNames(
                "flex gap-8",
                isDesktop ? "flex-row" : "flex-col"
              )}
            >
              <Section
                title={t("should_watch_today", { ns: "anime_home" })}
                className="w-full md:w-[80%] md:!pr-0"
              >
                <ShouldWatch type={MediaType.Anime} data={randomAnime} />
              </Section>

              <Section
                title={t("genres", { ns: "common" })}
                className="w-full md:w-[20%] md:!pl-0"
              >
                <GenreSwiper className="md:h-[500px]" />
              </Section>
            </div>

            <Section title={t("airing_schedule", { ns: "anime_home" })}>
              <AnimeScheduling schedules={schedulesAnime} />
            </Section>
          </div>
        </div>
      </ClientOnly>
    </React.Fragment>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const currentSeason = getSeason();
  const firstDayOfWeek = dayjs().startOf("week").unix();
  const lastDayOfWeek = dayjs().endOf("week").unix();

  await prodSleep(2500);

  const schedulesAnime = await getAllAiringSchedules({
    airingAt_greater: firstDayOfWeek,
    airingAt_lesser: lastDayOfWeek,
    perPage: 50,
    notYetAired: true,
  });

  await prodSleep(2500);

  const trendingAnime = await getMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
  });

  await prodSleep(2500);

  const popularSeason = await getMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Popularity_desc],
    season: currentSeason.season,
    seasonYear: currentSeason.year,
    perPage: 5,
  });

  await prodSleep(2500);

  const popularAllTime = await getMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Popularity_desc],
    perPage: 5,
  });

  await prodSleep(2500);

  const favouriteSeason = await getMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Favourites_desc],
    season: currentSeason.season,
    seasonYear: currentSeason.year,
    perPage: 5,
  });

  await prodSleep(2500);

  const favouriteAllTime = await getMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Favourites_desc],
    perPage: 5,
  });

  await prodSleep(2500);

  const recommendationsAnime = await getRecommendations({
    mediaId: randomElement(trendingAnime).id,
  });

  await prodSleep(2500);

  const recentlyUpdated = await getMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Updated_at_desc],
    isAdult: false,
  });

  await prodSleep(2500);

  const randomAnime = randomElement(recommendationsAnime).media;

  return {
    props: {
      trendingAnime,
      recentlyUpdated,
      randomAnime,
      schedulesAnime,
      popularSeason,
      popularAllTime,
      favouriteAllTime,
      favouriteSeason,
    },
    revalidate: REVALIDATE_TIME,
  };
};

export default Home;

import TopBanner from "@/components/features/ads/TopBanner";
import AnimeScheduling from "@/components/features/anime/AnimeScheduling";
import WatchedSection from "@/components/features/anime/WatchedSection";
import CardSwiper from "@/components/shared/CardSwiper";
import GenreSwiper from "@/components/shared/GenreSwiper";
import Head from "@/components/shared/Head";
import HomeBanner from "@/components/shared/HomeBanner";
import NewestComments from "@/components/shared/NewestComments";
import Section from "@/components/shared/Section";
import ShouldWatch from "@/components/shared/ShouldWatch";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useMedia from "@/hooks/useMedia";
import useRecentlyUpdated from "@/hooks/useRecentlyUpdated";
import { MediaSort, MediaStatus, MediaType } from "@/types/anilist";
import { randomElement } from "@/utils";
import classNames from "classnames";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";
import { getSelectorsByUserAgent } from "react-device-detect";

interface HomeProps {
  isMobile: boolean;
  isDesktop: boolean;
}

const Home: NextPage<HomeProps> = ({ isMobile, isDesktop }) => {
  const { t } = useTranslation();

  const { data: trendingAnime, isLoading: trendingLoading } = useMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
    perPage: isMobile ? 5 : 10,
  });

  const { data: recentlyUpdated, isLoading: recentlyUpdatedLoading } =
    useRecentlyUpdated();

  const { data: upcoming, isLoading: upcomingLoading } = useMedia({
    status: MediaStatus.Not_yet_released,
    sort: [MediaSort.Trending_desc],
    perPage: isMobile ? 5 : 10,
    type: MediaType.Anime,
  });

  const randomTrendingAnime = useMemo(() => {
    return randomElement(trendingAnime || []);
  }, [trendingAnime]);

  return (
    <React.Fragment>
      <Head
        title="Home (Anime) - Kaguya"
        description="Watch Anime Online for Free in High Quality and Fast Streaming, Watch and Download Anime Free on Kaguya"
      />

      <div className="pb-8">
        <HomeBanner
          isMobile={isMobile}
          data={trendingAnime}
          isLoading={trendingLoading}
        />

        <TopBanner />

        <div className="space-y-8">
          <WatchedSection />

          {recentlyUpdatedLoading ? (
            <ListSwiperSkeleton />
          ) : (
            <Section title={t("common:newly_added")}>
              <CardSwiper data={recentlyUpdated} />
            </Section>
          )}

          {upcomingLoading ? (
            <ListSwiperSkeleton />
          ) : (
            <Section title={t("anime_home:upcoming")}>
              <CardSwiper data={upcoming} />
            </Section>
          )}

          <NewestComments type={MediaType.Anime} />

          <div
            className={classNames(
              "flex gap-8",
              isDesktop ? "flex-row" : "flex-col"
            )}
          >
            <Section
              title={t("anime_home:should_watch_today")}
              className="w-full md:w-[80%] md:!pr-0"
            >
              {randomTrendingAnime && (
                <ShouldWatch
                  data={randomTrendingAnime}
                  isLoading={!randomTrendingAnime}
                />
              )}
            </Section>

            <Section
              title={t("common:genres")}
              className="w-full md:w-[20%] md:!pl-0"
            >
              <GenreSwiper isMobile={isMobile} className="md:h-[500px]" />
            </Section>
          </div>

          <Section title={t("anime_home:airing_schedule")}>
            <AnimeScheduling />
          </Section>
        </div>
      </div>
    </React.Fragment>
  );
};

Home.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;

  const { isMobile, isDesktop } = getSelectorsByUserAgent(userAgent);

  return {
    isMobile,
    isDesktop,
  };
};

export default Home;

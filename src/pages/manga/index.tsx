import TopBanner from "@/components/features/ads/TopBanner";
import ReadSection from "@/components/features/manga/ReadSection";
import RecommendedMangaSection from "@/components/features/manga/RecommendedMangaSection";
import CardSwiper from "@/components/shared/CardSwiper";
import GenreSwiper from "@/components/shared/GenreSwiper";
import Head from "@/components/shared/Head";
import HomeBanner from "@/components/shared/HomeBanner";
import NewestComments from "@/components/shared/NewestComments";
import Section from "@/components/shared/Section";
import ShouldWatch from "@/components/shared/ShouldWatch";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useMedia from "@/hooks/useMedia";
import { MediaSort, MediaStatus, MediaType } from "@/types/anilist";
import { randomElement } from "@/utils";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { NextPage } from "next/types";
import React, { useMemo } from "react";
import { getSelectorsByUserAgent } from "react-device-detect";

interface HomeProps {
  isMobile: boolean;
  isDesktop: boolean;
}

const Home: NextPage<HomeProps> = ({ isMobile, isDesktop }) => {
  const { t } = useTranslation();

  const { data: trendingManga, isLoading: trendingLoading } = useMedia({
    type: MediaType.Manga,
    sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
    perPage: isMobile ? 5 : 10,
  });

  const { data: recentlyUpdated, isLoading: recentlyUpdatedLoading } = useMedia(
    {
      type: MediaType.Manga,
      sort: [MediaSort.Updated_at_desc],
      isAdult: false,
      perPage: isMobile ? 5 : 10,
    }
  );

  const { data: upcoming, isLoading: upcomingLoading } = useMedia({
    status: MediaStatus.Not_yet_released,
    sort: [MediaSort.Trending_desc],
    perPage: isMobile ? 5 : 10,
    type: MediaType.Manga,
  });

  const randomTrendingManga = useMemo(() => {
    return randomElement(trendingManga || []);
  }, [trendingManga]);

  return (
    <React.Fragment>
      <Head
        title="Home (Manga) - Kaguya"
        description="Read Manga Online for Free in High Quality and Fast Updating, Read Manga Online, Absolutely Free and Updated Daily on Kaguya"
      />

      <div className="pb-8">
        <HomeBanner
          isMobile={isMobile}
          data={trendingManga}
          isLoading={trendingLoading}
        />

        <TopBanner />

        <div className="space-y-8">
          <ReadSection />
          <RecommendedMangaSection />

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

          <NewestComments type={MediaType.Manga} />

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
              {randomTrendingManga && (
                <ShouldWatch
                  data={randomTrendingManga}
                  isLoading={!randomTrendingManga}
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

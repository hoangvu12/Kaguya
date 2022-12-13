import TopBanner from "@/components/features/ads/TopBanner";
import ReadSection from "@/components/features/manga/ReadSection";
import RecommendedMangaSection from "@/components/features/manga/RecommendedMangaSection";
import CardSwiper from "@/components/shared/CardSwiper";
import ColumnSection from "@/components/shared/ColumnSection";
import GenreSwiper from "@/components/shared/GenreSwiper";
import Head from "@/components/shared/Head";
import HomeBanner from "@/components/shared/HomeBanner";
import NewestComments from "@/components/shared/NewestComments";
import Section from "@/components/shared/Section";
import ShouldWatch from "@/components/shared/ShouldWatch";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useMedia from "@/hooks/useMedia";
import useRecommendations from "@/hooks/useRecommendations";
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

  const { data: popularManga, isLoading: popularMangaLoading } = useMedia({
    type: MediaType.Manga,
    sort: [MediaSort.Popularity_desc],
    perPage: 5,
  });

  const { data: favouriteManga, isLoading: favouriteMangaLoading } = useMedia({
    type: MediaType.Manga,
    sort: [MediaSort.Favourites_desc],
    perPage: 5,
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

  const { data: recommendationsManga } = useRecommendations(
    {
      mediaId: randomTrendingManga?.id,
    },
    { enabled: !!randomTrendingManga }
  );

  const randomManga = useMemo(
    () => randomElement(recommendationsManga || [])?.media,
    [recommendationsManga]
  );

  return (
    <React.Fragment>
      <Head
        title="Trang chủ (Manga) - Kaguya"
        description="Đọc truyện manga hay tại Kaguya, cập nhật nhanh chóng, không quảng cáo và nhiều tính năng thú vị."
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

          <Section className="md:space-between flex flex-col items-center space-y-4 space-x-0 md:flex-row md:space-y-0 md:space-x-4">
            <ColumnSection
              title={t("common:most_popular")}
              type={MediaType.Manga}
              data={popularManga}
              viewMoreHref="/browse?sort=popularity&type=manga"
              isLoading={popularMangaLoading}
            />
            <ColumnSection
              title={t("common:most_favourite")}
              type={MediaType.Manga}
              data={favouriteManga}
              viewMoreHref="/browse?sort=favourites&type=manga"
              isLoading={favouriteMangaLoading}
            />
          </Section>

          <NewestComments type={MediaType.Manga} />

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
              {randomManga && (
                <ShouldWatch data={randomManga} isLoading={!randomManga} />
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

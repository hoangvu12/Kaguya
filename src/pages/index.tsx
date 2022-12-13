import TopBanner from "@/components/features/ads/TopBanner";
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
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useDevice from "@/hooks/useDevice";
import useMedia from "@/hooks/useMedia";
import useRecentlyUpdated from "@/hooks/useRecentlyUpdated";
import useRecommendations from "@/hooks/useRecommendations";
import { MediaSort, MediaStatus, MediaType } from "@/types/anilist";
import { getSeason, randomElement } from "@/utils";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";
import { isMobile } from "react-device-detect";

const Home = () => {
  const currentSeason = useMemo(getSeason, []);
  const { isDesktop } = useDevice();
  const { t } = useTranslation();

  const { data: trendingAnime, isLoading: trendingLoading } = useMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
    perPage: isMobile ? 5 : 10,
  });

  const { data: popularSeason, isLoading: popularSeasonLoading } = useMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Popularity_desc],
    season: currentSeason.season,
    seasonYear: currentSeason.year,
    perPage: 5,
  });

  const { data: popularAllTime, isLoading: popularAllTimeLoading } = useMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Popularity_desc],
    perPage: 5,
  });

  const { data: favouriteSeason, isLoading: favouriteSeasonLoading } = useMedia(
    {
      type: MediaType.Anime,
      sort: [MediaSort.Favourites_desc],
      season: currentSeason.season,
      seasonYear: currentSeason.year,
      perPage: 5,
    }
  );

  const { data: favouriteAllTime, isLoading: favouriteAllTimeLoading } =
    useMedia({
      type: MediaType.Anime,
      sort: [MediaSort.Favourites_desc],
      perPage: 5,
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

  const { data: recommendationsAnime } = useRecommendations(
    {
      mediaId: randomTrendingAnime?.id,
    },
    { enabled: !!randomTrendingAnime }
  );

  const randomAnime = useMemo(
    () => randomElement(recommendationsAnime || [])?.media,
    [recommendationsAnime]
  );

  return (
    <React.Fragment>
      <Head
        title="Trang chủ (Anime) - Kaguya"
        description="Xem anime hay tại Kaguya, cập nhật nhanh chóng, không quảng cáo và nhiều tính năng thú vị."
      />

      <div className="pb-8">
        <HomeBanner data={trendingAnime} isLoading={trendingLoading} />

        <TopBanner />

        <div className="space-y-8">
          <WatchedSection />
          <RecommendedAnimeSection />

          <Section className="md:space-between flex flex-col items-center space-y-4 space-x-0 md:flex-row md:space-y-0 md:space-x-4">
            <ColumnSection
              title={t("common:most_popular_season")}
              type={MediaType.Anime}
              data={popularSeason}
              viewMoreHref={`/browse?sort=popularity&type=anime&season=${currentSeason.season}&seasonYear=${currentSeason.year}`}
              isLoading={popularSeasonLoading}
            />
            <ColumnSection
              title={t("common:most_popular")}
              type={MediaType.Anime}
              data={popularAllTime}
              viewMoreHref="/browse?sort=popularity&type=anime"
              isLoading={popularAllTimeLoading}
            />
            <ColumnSection
              title={t("common:most_favourite_season")}
              type={MediaType.Anime}
              data={favouriteSeason}
              viewMoreHref={`/browse?sort=favourites&type=anime&season=${currentSeason.season}&seasonYear=${currentSeason.year}`}
              isLoading={favouriteSeasonLoading}
            />
            <ColumnSection
              title={t("common:most_favourite")}
              type={MediaType.Anime}
              data={favouriteAllTime}
              viewMoreHref="/browse?sort=favourites&type=anime"
              isLoading={favouriteAllTimeLoading}
            />
          </Section>

          <NewestComments type={MediaType.Anime} />

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
              title={t("anime_home:should_watch_today")}
              className="w-full md:w-[80%] md:!pr-0"
            >
              {randomAnime && (
                <ShouldWatch data={randomAnime} isLoading={!randomAnime} />
              )}
            </Section>

            <Section
              title={t("common:genres")}
              className="w-full md:w-[20%] md:!pl-0"
            >
              <GenreSwiper className="md:h-[500px]" />
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

export default Home;

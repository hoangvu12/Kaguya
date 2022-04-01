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
import supabase from "@/lib/supabase";
import { AiringSchedule, Anime } from "@/types";
import { getSeason } from "@/utils";
import classNames from "classnames";
import { GetStaticProps, NextPage } from "next";
import React, { useMemo } from "react";

interface HomeProps {
  trendingAnime: Anime[];
  randomAnime: Anime;
  recentlyUpdatedAnime: Anime[];
  schedulesAnime: AiringSchedule[];
  popularSeason: Anime[];
  popularAllTime: Anime[];
  favouriteSeason: Anime[];
  favouriteAllTime: Anime[];
}

const Home: NextPage<HomeProps> = ({
  trendingAnime,
  randomAnime,
  recentlyUpdatedAnime,
  schedulesAnime,
  favouriteAllTime,
  favouriteSeason,
  popularAllTime,
  popularSeason,
}) => {
  const currentSeason = useMemo(getSeason, []);
  const { isDesktop } = useDevice();

  return (
    <React.Fragment>
      <Head />

      <ClientOnly>
        <div className="pb-8">
          <HomeBanner type="anime" data={trendingAnime} />

          <div className="space-y-8">
            <WatchedSection />
            <RecommendedAnimeSection />

            <Section className="flex flex-col md:flex-row items-center md:space-between space-y-4 space-x-0 md:space-y-0 md:space-x-4">
              <ColumnSection
                title="Nổi bật mùa này"
                type="anime"
                data={popularSeason}
                viewMoreHref={`/browse?sort=popularity&type=anime&season=${currentSeason.season}&seasonYear=${currentSeason.year}`}
              />
              <ColumnSection
                title="Nổi bật nhất"
                type="anime"
                data={popularAllTime}
                viewMoreHref="/browse?sort=popularity&type=anime"
              />
              <ColumnSection
                title="Được yêu thích mùa này"
                type="anime"
                data={favouriteSeason}
                viewMoreHref={`/browse?sort=favourites&type=anime&season=${currentSeason.season}&seasonYear=${currentSeason.year}`}
              />
              <ColumnSection
                title="Được yêu thích"
                type="anime"
                data={favouriteAllTime}
                viewMoreHref="/browse?sort=favourites&type=anime"
              />
            </Section>

            <NewestComments type="anime" />

            <Section title="Mới cập nhật">
              <CardSwiper type="anime" data={recentlyUpdatedAnime} />
            </Section>

            <div
              className={classNames(
                "flex gap-8",
                isDesktop ? "flex-row" : "flex-col"
              )}
            >
              <Section
                title="Xem gì hôm nay?"
                className="w-full md:w-[80%] md:!pr-0"
              >
                <ShouldWatch type="anime" data={randomAnime} />
              </Section>

              <Section title="Thể loại" className="w-full md:w-[20%] md:!pl-0">
                <GenreSwiper className="md:h-[500px]" />
              </Section>
            </div>

            <Section title="Lịch phát sóng">
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
  const firstDayOfWeek = dayjs().startOf("week");
  const lastDayOfWeek = dayjs().endOf("week");

  const { data: schedulesAnime, error } = await supabase
    .from<AiringSchedule>("kaguya_airing_schedules")
    .select(
      "*, media:mediaId(coverImage, genres, averageScore, favourites, title, vietnameseTitle, id)"
    )
    .lte("airingAt", lastDayOfWeek.unix())
    .gte("airingAt", firstDayOfWeek.unix());

  const { data: trendingAnime } = await supabase
    .from<Anime>("kaguya_anime")
    .select("*")
    .order("trending", { ascending: false })
    .not("bannerImage", "is", null)
    .limit(15);

  const { data: recentlyUpdatedAnime } = await supabase
    .from<Anime>("kaguya_anime")
    .select(
      "coverImage, genres, averageScore, favourites, title, vietnameseTitle, id"
    )
    .order("episodeUpdatedAt", { ascending: false })
    .limit(15);

  const { data: randomAnime } = await supabase
    .rpc<Anime>("anime_random")
    .limit(1)
    .not("bannerImage", "is", null)
    .single();

  const { data: popularSeason } = await supabase
    .from<Anime>("kaguya_anime")
    .select(
      "id, coverImage, genres, title, vietnameseTitle, format, season, seasonYear, status"
    )
    .order("popularity", { ascending: false })
    .eq("season", currentSeason.season)
    .eq("seasonYear", currentSeason.year)
    .limit(5);

  const { data: popularAllTime } = await supabase
    .from<Anime>("kaguya_anime")
    .select(
      "id, coverImage, genres, title, vietnameseTitle, format, season, seasonYear, status"
    )
    .order("popularity", { ascending: false })
    .limit(5);

  const { data: favouriteSeason } = await supabase
    .from<Anime>("kaguya_anime")
    .select(
      "id, coverImage, genres, title, vietnameseTitle, format, season, seasonYear, status"
    )
    .order("favourites", { ascending: false })
    .eq("season", currentSeason.season)
    .eq("seasonYear", currentSeason.year)
    .limit(5);

  const { data: favouriteAllTime } = await supabase
    .from<Anime>("kaguya_anime")
    .select(
      "id, coverImage, genres, title, vietnameseTitle, format, season, seasonYear, status"
    )
    .order("favourites", { ascending: false })
    .limit(5);

  return {
    props: {
      trendingAnime,
      recentlyUpdatedAnime,
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

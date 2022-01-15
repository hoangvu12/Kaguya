import AnimeScheduling from "@/components/features/anime/AnimeScheduling";
import GenresSelector from "@/components/shared/GenresSelector";
import HomeBanner from "@/components/shared/HomeBanner";
import RecommendedAnimeSection from "@/components/features/anime/RecommendedAnimeSection";
import Section from "@/components/shared/Section";
import ShouldWatch from "@/components/shared/ShouldWatch";
import WatchedSection from "@/components/features/anime/WatchedSection";
import CardSwiper from "@/components/shared/CardSwiper";
import ClientOnly from "@/components/shared/ClientOnly";
import Head from "@/components/shared/Head";
import TopList from "@/components/shared/TopList";
import { REVALIDATE_TIME } from "@/constants";
import dayjs from "@/lib/dayjs";
import supabase from "@/lib/supabase";
import { AiringSchedule, Anime } from "@/types";
import { getSeason } from "@/utils";
import { GetStaticProps, NextPage } from "next";
import React from "react";
import NewestComments from "@/components/shared/NewestComments";

interface HomeProps {
  trendingAnime: Anime[];
  topAnime: Anime[];
  randomAnime: Anime;
  recentlyUpdatedAnime: Anime[];
  schedulesAnime: AiringSchedule[];
}

const Home: NextPage<HomeProps> = ({
  trendingAnime,
  topAnime,
  randomAnime,
  recentlyUpdatedAnime,
  schedulesAnime,
}) => {
  return (
    <React.Fragment>
      <Head />

      <ClientOnly>
        <div className="pb-8">
          <HomeBanner type="anime" data={trendingAnime} />

          <div className="space-y-8">
            <WatchedSection />
            <RecommendedAnimeSection />
            <NewestComments type="anime" />

            <Section title="Anime mới cập nhật">
              <CardSwiper type="anime" data={recentlyUpdatedAnime} />
            </Section>

            <ShouldWatch type="anime" data={randomAnime} />

            <Section title="Lịch phát sóng">
              <AnimeScheduling schedules={schedulesAnime} />
            </Section>

            <Section title="Thể loại">
              <GenresSelector />
            </Section>

            <Section title="Top anime">
              <TopList type="anime" data={topAnime} />
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

  const { data: schedulesAnime } = await supabase
    .from<AiringSchedule>("airing_schedule")
    .select("*, anime:anime_id(*)")
    .lte("airing_at", lastDayOfWeek.unix())
    .gte("airing_at", firstDayOfWeek.unix())
    .limit(1, {
      foreignTable: "anime",
    });

  const { data: trendingAnime } = await supabase
    .from<Anime>("anime")
    .select("*")
    .order("trending", { ascending: false })
    .not("banner_image", "is", null)
    .limit(15);

  const { data: recentlyUpdatedAnime } = await supabase
    .from<Anime>("anime")
    .select("*")
    .order("episodes_updated_at", { ascending: false })
    .limit(15);

  const { data: randomAnime } = await supabase
    .rpc<Anime>("anime_random")
    .limit(1)
    .not("banner_image", "is", null)
    .single();

  const { data: topAnime } = await supabase
    .from<Anime>("anime")
    .select("*")
    .order("average_score", { ascending: false })
    .eq("season", currentSeason.season)
    .eq("season_year", currentSeason.year)
    .limit(10);

  return {
    props: {
      trendingAnime,
      recentlyUpdatedAnime,
      randomAnime,
      topAnime,
      schedulesAnime,
    },

    revalidate: REVALIDATE_TIME,
  };
};

export default Home;

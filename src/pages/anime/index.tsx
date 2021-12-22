import Section from "@/components/seldom/Section";
import HomeBanner from "@/components/seldom/HomeBanner";
import ShouldWatch from "@/components/seldom/ShouldWatch";
import WatchedSection from "@/components/seldom/WatchedSection";
import CardSwiper from "@/components/shared/CardSwiper";
import ClientOnly from "@/components/shared/ClientOnly";
import Head from "@/components/shared/Head";
import TopList from "@/components/shared/TopList";
import supabase from "@/lib/supabase";
import { Anime } from "@/types";
import { GetStaticProps, NextPage } from "next";
import React from "react";
import { REVALIDATE_TIME } from "@/constants";
import { getSeason } from "@/utils";
import GenresSelector from "@/components/seldom/GenresSelector";

interface HomeProps {
  trendingAnime: Anime[];
  topAnime: Anime[];
  randomAnime: Anime;
  recentlyUpdatedAnime: Anime[];
}

const Home: NextPage<HomeProps> = ({
  trendingAnime,
  topAnime,
  randomAnime,
  recentlyUpdatedAnime,
}) => {
  return (
    <React.Fragment>
      <Head />

      <ClientOnly>
        <div className="pb-8">
          <HomeBanner type="anime" data={trendingAnime} />

          <div className="space-y-8">
            <WatchedSection />

            <Section title="Mới cập nhật">
              <CardSwiper type="anime" data={recentlyUpdatedAnime} />
            </Section>

            <ShouldWatch type="anime" data={randomAnime} />

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
    },

    revalidate: REVALIDATE_TIME,
  };
};

export default Home;

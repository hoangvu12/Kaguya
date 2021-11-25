import Section from "@/components/seldom/Section";
import HomeBanner from "@/components/seldom/HomeBanner";
import ShouldWatch from "@/components/seldom/ShouldWatch";
import WatchedSection from "@/components/seldom/WatchedSection";
import CardSwiper from "@/components/shared/CardSwiper";
import ClientOnly from "@/components/shared/ClientOnly";
import Head from "@/components/shared/Head";
import TopList from "@/components/shared/TopList";
import supabase from "@/lib/supabase";
import { Anime, Manga } from "@/types";
import { GetStaticProps, NextPage } from "next";
import React from "react";
import { REVALIDATE_TIME } from "@/constants";
import { getSeason } from "@/utils";

interface HomeProps {
  trendingAnime: Anime[];
  topAnime: Anime[];
  randomAnime: Anime;
  recentlyUpdatedAnime: Anime[];
  topManga: Manga[];
  recentlyUpdatedManga: Manga[];
}

const Home: NextPage<HomeProps> = ({
  trendingAnime,
  topAnime,
  randomAnime,
  recentlyUpdatedAnime,
  recentlyUpdatedManga,
  topManga,
}) => {
  return (
    <React.Fragment>
      <Head />

      <ClientOnly>
        <div className="pb-8">
          <HomeBanner data={trendingAnime} />

          <div className="space-y-8">
            <WatchedSection />

            <Section title="Anime mới cập nhật">
              <CardSwiper data={recentlyUpdatedAnime} />
            </Section>

            <ShouldWatch data={randomAnime} />

            <Section title="Top anime">
              <TopList data={topAnime} />
            </Section>

            <Section title="Manga mới cập nhật">
              <CardSwiper type="manga" data={recentlyUpdatedManga} />
            </Section>

            <Section title="Top manga">
              <TopList type="manga" data={topManga} />
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

  const { data: recentlyUpdatedManga } = await supabase
    .from<Manga>("manga")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(15);

  const { data: topManga } = await supabase
    .from<Manga>("manga")
    .select("*")
    .order("average_score", { ascending: false })
    .limit(10);

  return {
    props: {
      trendingAnime,
      recentlyUpdatedAnime,
      randomAnime,
      topAnime,
      recentlyUpdatedManga,
      topManga,
    },

    revalidate: REVALIDATE_TIME,
  };
};

export default Home;

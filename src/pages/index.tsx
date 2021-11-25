import AnimeSection from "@/components/seldom/AnimeSection";
import HomeBanner from "@/components/seldom/HomeBanner";
import ShouldWatch from "@/components/seldom/ShouldWatch";
import WatchedSection from "@/components/seldom/WatchedSection";
import AnimeSwiper from "@/components/shared/AnimeSwiper";
import ClientOnly from "@/components/shared/ClientOnly";
import Head from "@/components/shared/Head";
import TopAnimeList from "@/components/shared/TopAnimeList";
import supabase from "@/lib/supabase";
import { Anime } from "@/types";
import { GetStaticProps, NextPage } from "next";
import React from "react";
import { REVALIDATE_TIME } from "../constants";
import { getSeason } from "../utils";

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
          <HomeBanner anime={trendingAnime} />
          <div className="space-y-8">
            <WatchedSection />

            <AnimeSection title="Mới cập nhật">
              <AnimeSwiper data={recentlyUpdatedAnime} />
            </AnimeSection>

            <ShouldWatch anime={randomAnime} />

            <AnimeSection title="Top anime">
              <TopAnimeList anime={topAnime} />
            </AnimeSection>
          </div>
        </div>
      </ClientOnly>
    </React.Fragment>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const currentSeason = getSeason();

  console.log("GET STATIC PROPS");

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

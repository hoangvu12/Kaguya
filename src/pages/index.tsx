import AnimeSection from "@/components/seldom/AnimeSection";
import HomeBanner from "@/components/seldom/HomeBanner";
import AnimeSwiper from "@/components/shared/AnimeSwiper";
import Head from "@/components/shared/Head";
import TopAnimeList from "@/components/shared/TopAnimeList";
import AnimeSwiperSkeleton from "@/components/skeletons/AnimeSwiperSkeleton";
import TopAnimeListSkeleton from "@/components/skeletons/TopAnimeListSkeleton";
import supabase from "@/lib/supabase";
import { Anime, Section } from "@/types";
import { getSeason } from "@/utils";
import React from "react";

const currentSeason = getSeason();

const sections: Section<Anime>[] = [
  {
    title: "Mới cập nhật",
    query: {
      key: "new-episodes-anime",
      queryFn: () =>
        supabase
          .from<Anime>("anime")
          .select("*")
          .order("episodes_updated_at", { ascending: false })
          .limit(15),
    },
    skeleton: AnimeSwiperSkeleton,
    render: (data) => <AnimeSwiper data={data} />,
  },
  {
    title: "Nổi bật",
    query: {
      key: "popular-anime",
      queryFn: () =>
        supabase
          .from<Anime>("anime")
          .select("*")
          .order("popularity", { ascending: false })
          .eq("season", currentSeason.season)
          .eq("season_year", currentSeason.year)
          .limit(15),
    },
    skeleton: AnimeSwiperSkeleton,
    render: (data) => <AnimeSwiper data={data} />,
  },
  {
    title: "Được yêu thích",
    query: {
      key: "favourite-anime",
      queryFn: () =>
        supabase
          .from<Anime>("anime")
          .select("*")
          .order("favourites", { ascending: false })
          .eq("season", currentSeason.season)
          .eq("season_year", currentSeason.year)
          .limit(15),
    },
    skeleton: AnimeSwiperSkeleton,
    render: (data) => <AnimeSwiper data={data} />,
  },
  {
    title: "Top anime",
    skeleton: TopAnimeListSkeleton,
    query: {
      key: "top-anime",
      queryFn: () =>
        supabase
          .from<Anime>("anime")
          .select("*")
          .order("average_score", { ascending: false })
          .eq("season", currentSeason.season)
          .eq("season_year", currentSeason.year)
          .limit(10),
    },
    render: (data) => <TopAnimeList anime={data} />,
  },
];

export default function Home() {
  return (
    <React.Fragment>
      <Head />

      <div className="pb-8">
        <HomeBanner />

        <div className="space-y-8">
          {sections.map(({ render, ...section }, index) => (
            <AnimeSection key={index} {...section}>
              {render}
            </AnimeSection>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

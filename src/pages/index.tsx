import AnimeSection from "@/components/seldom/AnimeSection";
import HomeBanner from "@/components/seldom/HomeBanner";
import AnimeSwiper from "@/components/shared/AnimeSwiper";
import TopAnimeCard from "@/components/shared/TopAnimeCard";
import TopAnimeList from "@/components/shared/TopAnimeList";
import AnimeSwiperSkeleton from "@/components/skeletons/AnimeSwiperSkeleton";
import supabase from "@/lib/supabase";
import { Anime } from "@/types";
import { getSeason } from "@/utils";
import data from "@/data.json";
import TopAnimeListSkeleton from "@/components/skeletons/TopAnimeListSkeleton";

const currentSeason = getSeason();

const swipers = [
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
          .limit(30),
    },
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
          .limit(30),
    },
  },
];

export default function Home() {
  return (
    <div className="pb-8">
      <HomeBanner />

      <div className="space-y-8">
        {swipers.map((swiper) => (
          <AnimeSection
            skeleton={AnimeSwiperSkeleton}
            key={swiper.query.key}
            {...swiper}
          >
            {(data) => <AnimeSwiper data={data as Anime[]} />}
          </AnimeSection>
        ))}

        <AnimeSection
          skeleton={TopAnimeListSkeleton}
          query={{
            key: "top-anime",
            queryFn: () =>
              supabase
                .from<Anime>("anime")
                .select("*")
                .order("average_score", { ascending: false })
                .eq("season", currentSeason.season)
                .eq("season_year", currentSeason.year)
                .limit(10),
          }}
          title="Top anime"
        >
          {(data) => <TopAnimeList anime={data as Anime[]} />}
        </AnimeSection>
      </div>
    </div>
  );
}

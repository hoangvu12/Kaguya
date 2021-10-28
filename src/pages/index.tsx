import HomeBanner from "@/components/seldom/HomeBanner";
import AnimeSwiper from "@/components/shared/AnimeSwiper";
import supabase from "@/lib/supabase";
import { Anime } from "@/types";
import { getSeason } from "@/utils";

const currentSeason = getSeason();

const swipers = [
  {
    title: "Xu hướng",
    query: {
      key: "trending-anime",
      queryFn: () =>
        supabase
          .from<Anime>("anime")
          .select("*")
          .order("trending", { ascending: false })
          .limit(30),
    },
  },
  {
    title: "Nổi bật mùa này",
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
    title: "Được yêu thích mùa này",
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
          <AnimeSwiper {...swiper} key={swiper.query.key} />
        ))}
      </div>
    </div>
  );
}

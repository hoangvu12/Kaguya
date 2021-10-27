import HomeBanner from "@/components/seldom/HomeBanner";
import AnimeCard from "@/components/shared/AnimeCard";
import AnimeSwiper from "@/components/shared/AnimeSwiper";

export default function Home() {
  return (
    <div className="pb-8">
      <HomeBanner />
      <div className="space-y-8">
        <AnimeSwiper title="Xu hướng" />
        {/* <AnimeSwiper title="Nổi bật mùa này" />
        <AnimeSwiper title="Được yêu thích" /> */}
      </div>
    </div>
  );
}

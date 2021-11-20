import useWatched from "@/hooks/useWatched";
import React from "react";
import WatchedSwiperSkeleton from "../skeletons/WatchedSwiperSkeleton";
import AnimeSection from "./AnimeSection";
import WatchedSwiper from "./WatchedSwiper";

const WatchedSection = () => {
  const { data, isLoading, isError } = useWatched();

  if (isLoading) {
    return <WatchedSwiperSkeleton />;
  }

  if (!data?.length || isError) {
    return null;
  }

  return (
    <AnimeSection title="Xem gần đây">
      <WatchedSwiper
        data={data}
        slidesPerView={5}
        slidesPerGroup={5}
        breakpoints={{
          1280: {
            slidesPerView: 4,
            slidesPerGroup: 4,
          },
          1024: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          768: {
            slidesPerView: 2,
            slidesPerGroup: 2,
          },
          0: {
            slidesPerView: 1,
            slidesPerGroup: 1,
          },
        }}
      />
    </AnimeSection>
  );
};

export default WatchedSection;

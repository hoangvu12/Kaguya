import useWatched from "@/hooks/useWatched";
import React from "react";
import WatchedSwiperSkeleton from "../skeletons/WatchedSwiperSkeleton";
import WatchedSwiper from "./WatchedSwiper";

const WatchedSection = () => {
  const { data, isLoading } = useWatched();

  if (isLoading) {
    return <WatchedSwiperSkeleton />;
  }

  return (
    <div className="px-4 md:px-12 space-y-4">
      <h1 className="uppercase text-2xl font-semibold">Xem gần đây</h1>
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
      ></WatchedSwiper>
    </div>
  );
};

export default WatchedSection;

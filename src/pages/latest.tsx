import AnimeSwiperSkeleton from "@/components/skeletons/AnimeSwiperSkeleton";
import HomeBannerSkeleton from "@/components/skeletons/HomeBannerSkeleton";
import React from "react";

const LatestPage = () => {
  return (
    <div className="pb-8">
      <HomeBannerSkeleton />

      <div className="space-y-8 mt-12">
        <AnimeSwiperSkeleton />
        <AnimeSwiperSkeleton />
      </div>
    </div>
  );
};

export default LatestPage;

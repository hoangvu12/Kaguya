import { Watched } from "@/types";
import Storage from "@/utils/storage";
import React, { useEffect, useState } from "react";
import WatchedSwiper from "./WatchedSwiper";

const WatchedSection = () => {
  const [data, setData] = useState<Watched[]>(null);

  useEffect(() => {
    const storage = new Storage("watched");

    setData(storage.find<Watched>().reverse());
  }, []);

  if (!data?.length) {
    return null;
  }

  return (
    <div className="px-4 md:px-12 space-y-4">
      <h1 className="uppercase text-2xl font-semibold">Xem gần đây</h1>
      <WatchedSwiper
        data={data}
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
          640: {
            slidesPerView: 1,
            slidesPerGroup: 1,
          },
        }}
      ></WatchedSwiper>
    </div>
  );
};

export default WatchedSection;

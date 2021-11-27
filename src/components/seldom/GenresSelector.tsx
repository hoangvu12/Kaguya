import { GENRES } from "@/constants";
import React from "react";
import Link from "next/link";
import Image from "@/components/shared/Image";
import Swiper, { SwiperSlide } from "@/components/shared/Swiper";

interface GenresSelectorProps {
  type?: "anime" | "manga";
}

const GenresSelector: React.FC<GenresSelectorProps> = ({ type = "anime" }) => {
  return (
    <Swiper>
      {GENRES.map((genre) => (
        <SwiperSlide key={genre.value}>
          <Link href={`/browse?type=${type}&genre=${genre.value}`}>
            <a>
              <div className="group relative aspect-w-16 aspect-h-9">
                <Image
                  src={genre.thumbnail}
                  alt={genre.value}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md group-hover:scale-105 transition duration-300"
                />

                <div className="flex items-center justify-center absolute inset-0 bg-black/60">
                  <p className="uppercase text-xl font-bold tracking-widest text-gray-300 group-hover:text-white transition duration-300">
                    {genre.value}
                  </p>
                </div>
              </div>
            </a>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default GenresSelector;

import supabase from "@/lib/supabase";
import { Anime } from "@/types";
import { SupabaseQueryFunction, useSupabaseQuery } from "@/utils/supabase";
import { PostgrestError } from "@supabase/postgrest-js";
import React from "react";
import { QueryFunction, QueryOptions, useQuery } from "react-query";
import AnimeSwiperSkeleton from "../skeletons/AnimeSwiperSkeleton";
import AnimeCard from "./AnimeCard";
import Swiper, { SwiperSlide } from "./Swiper";

interface AnimeSwiperProps {
  title: string;
  viewAllRedirect?: string;
  query: {
    key: string;
    queryFn: SupabaseQueryFunction<Anime>;
    options?: QueryOptions<Anime>;
  };
}

const AnimeSwiper: React.FC<AnimeSwiperProps> = (props) => {
  const { title, query } = props;
  const { data, isLoading } = useSupabaseQuery<Anime>(
    query.key,
    query.queryFn,
    query.options
  );

  if (isLoading) {
    return <AnimeSwiperSkeleton />;
  }

  if (!Array.isArray(data)) return null;

  return (
    <div className="px-12 space-y-4">
      <h1 className="uppercase text-2xl font-semibold">{title}</h1>

      <Swiper slidesPerGroup={6} speed={500}>
        {data.map((anime, index) => (
          <SwiperSlide key={index}>
            <AnimeCard anime={anime} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AnimeSwiper;

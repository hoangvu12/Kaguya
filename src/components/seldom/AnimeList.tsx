import { Anime } from "@/types";
import React from "react";
import AnimeCard from "../shared/AnimeCard";

interface AnimeListProps {
  data: Anime[];
}

const AnimeList: React.FC<AnimeListProps> = ({ data }) => {
  return (
    <React.Fragment>
      {data.map((anime) => (
        <div
          className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 px-2"
          key={anime.ani_id}
        >
          <AnimeCard anime={anime} />
        </div>
      ))}
    </React.Fragment>
  );
};

export default AnimeList;

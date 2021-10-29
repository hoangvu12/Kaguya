import { Anime } from "@/types";
import React from "react";
import TopAnimeCard from "./TopAnimeCard";

interface TopAnimeListProps {
  anime: Anime[];
}

const TopAnimeList: React.FC<TopAnimeListProps> = ({ anime: animeList }) => {
  return (
    <div className="space-y-10">
      {animeList.map((anime, index) => (
        <TopAnimeCard rank={index + 1} anime={anime} key={anime.ani_id} />
      ))}
    </div>
  );
};

export default TopAnimeList;

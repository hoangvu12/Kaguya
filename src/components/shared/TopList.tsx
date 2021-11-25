import { Anime, Manga } from "@/types";
import React from "react";
import TopCard from "./TopCard";

interface TopListProps {
  data: Anime[] | Manga[];
  type?: "anime" | "manga";
}

const TopList: React.FC<TopListProps> = ({ data, type = "anime" }) => {
  return (
    <div className="space-y-10">
      {data.map((item, index) => (
        <TopCard type={type} rank={index + 1} data={item} key={item.ani_id} />
      ))}
    </div>
  );
};

export default TopList;

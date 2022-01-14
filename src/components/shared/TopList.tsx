import { Anime, DynamicData, Manga } from "@/types";
import React from "react";
import TopCard from "@/components/shared/TopCard";

const TopList: React.FC<DynamicData<Anime[], Manga[]>> = ({
  data,
  type = "anime",
}) => {
  return (
    <div className="space-y-10">
      {data.map((item, index) => (
        <TopCard type={type} rank={index + 1} data={item} key={item.ani_id} />
      ))}
    </div>
  );
};

export default TopList;

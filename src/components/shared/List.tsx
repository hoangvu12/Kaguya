import { Anime, Manga } from "@/types";
import classNames from "classnames";
import React from "react";
import Card from "./Card";

interface ListProps {
  data: Anime[] | Manga[];
  type?: "anime" | "manga";
}

const List: React.FC<ListProps> = ({ data, type }) => {
  return (
    <div
      className={classNames(
        data.length ? "flex flex-wrap -my-8" : "text-center"
      )}
    >
      {data.length ? (
        data.map((item) => (
          <div
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 px-2 snap-mandatory my-8"
            key={item.ani_id}
          >
            <Card data={item} type={type} />
          </div>
        ))
      ) : (
        <p className="text-2xl">Không có dữ liệu.</p>
      )}
    </div>
  );
};

export default List;

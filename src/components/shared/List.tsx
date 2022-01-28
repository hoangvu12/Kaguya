import Card from "@/components/shared/Card";
import { Anime, Character, Manga } from "@/types";
import classNames from "classnames";
import React from "react";

type Data<T> = T extends "anime"
  ? Anime
  : T extends "characters"
  ? Character
  : Manga;
interface ListProps<T> {
  data: Data<T>[];
  type: T;
  onEachCard?: (data: Data<T>) => React.ReactNode;
}

const List = <T extends "anime" | "manga" | "characters">({
  data,
  type,
  // @ts-ignore
  onEachCard = (data) => <Card data={data} type={type} />,
}: ListProps<T>) => {
  return (
    <div
      className={classNames(
        data.length
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          : "text-center"
      )}
    >
      {data.length ? (
        data.map((item, index) => (
          <div className="col-span-1" key={index}>
            {onEachCard(item)}
          </div>
        ))
      ) : (
        <p className="text-2xl">Không có dữ liệu.</p>
      )}
    </div>
  );
};

export default React.memo(List) as typeof List;

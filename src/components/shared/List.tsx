import { Anime, Manga } from "@/types";
import classNames from "classnames";
import React, { PropsWithChildren } from "react";
import Card from "@/components/shared/Card";

interface ListProps<T> {
  data: T extends "anime" ? Anime[] : Manga[];
  type: T;

  onEachCard?: (data: T extends "anime" ? Anime : Manga) => React.ReactNode;
}

const List = <T extends "anime" | "manga">({
  data,
  type,
  onEachCard = (data) => <Card data={data} type={type} />,
}: ListProps<T>) => {
  return (
    <div
      className={classNames(
        data.length ? "flex flex-wrap -my-8" : "text-center"
      )}
    >
      {data.length ? (
        data.map((item) => (
          <div
            className="w-1/2 px-2 my-8 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 snap-mandatory"
            key={item.ani_id}
          >
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

import AnimeBrowseList from "@/components/seldom/AnimeBrowseList";
import MangaBrowseList from "@/components/seldom/MangaBrowseList";
import { Anime, Format, Genre, Manga } from "@/types";
import React from "react";

const BrowsePage = ({ query }) => {
  const {
    format = undefined,
    keyword = "",
    genre = undefined,
    season = undefined,
    seasonYear = undefined,
    sort = "popularity",
    type,
  } = query;

  const baseQuery = {
    format: format as Format,
    keyword: keyword as string,
    genre: genre as Genre,
    type: type as "manga" | "anime",
  };

  const animeBrowseQuery = {
    ...baseQuery,
    season: season as string,
    seasonYear: seasonYear as string,
    sort: sort as keyof Anime,
  };

  const mangaBrowseQuery = {
    ...baseQuery,
    sort: sort as keyof Manga,
  };

  return (
    <div className="py-20">
      {type === "anime" ? (
        <AnimeBrowseList title="Tìm kiếm" defaultQuery={animeBrowseQuery} />
      ) : (
        <MangaBrowseList title="Tìm kiếm" defaultQuery={mangaBrowseQuery} />
      )}
    </div>
  );
};

BrowsePage.getInitialProps = ({ query }) => {
  return { query };
};

export default BrowsePage;

import AnimeBrowseList from "@/components/seldom/AnimeBrowseList";
import MangaBrowseList from "@/components/seldom/MangaBrowseList";
import { Anime, Format, Genre, Manga } from "@/types";
import React from "react";

const BrowsePage = ({ query }) => {
  const {
    format = undefined,
    keyword = "",
    season = undefined,
    seasonYear = undefined,
    sort = "popularity",
    type,
    genres = [],
    tags = [],
    countries = [],
  } = query;

  const convertQueryToArray = <T,>(query: T[]) => {
    if (typeof query === "string") return [query];

    return query;
  };

  const baseQuery = {
    format: format as Format,
    keyword: keyword as string,
    type: type as "manga" | "anime",
    genres: convertQueryToArray<Genre>(genres),
    tags: convertQueryToArray<string>(tags),
    countries: convertQueryToArray<string>(countries),
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

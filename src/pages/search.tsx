import BrowseList from "@/components/seldom/BrowseList";
import { UseBrowseOptions } from "@/hooks/useBrowse";
import { Anime } from "@/types";
import React from "react";

const SearchPage = ({ query }) => {
  const {
    format = undefined,
    keyword = "",
    genre = undefined,
    season = undefined,
    seasonYear = undefined,
    sort = "popularity",
    type,
  } = query;

  const browseQuery: UseBrowseOptions = {
    format: format as string,
    keyword: keyword as string,
    genre: genre as string,
    season: season as string,
    seasonYear: seasonYear as string,
    sort: sort as keyof Anime,
    type: type as "anime" | "manga",
  };

  return (
    <div className="py-20">
      <BrowseList title="Tìm kiếm" defaultQuery={browseQuery} />
    </div>
  );
};

SearchPage.getInitialProps = ({ query }) => {
  return { query };
};

export default SearchPage;

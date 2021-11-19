import BrowseList from "@/components/seldom/BrowseList";
import ClientOnly from "@/components/shared/ClientOnly";
import { UseBrowseOptions } from "@/hooks/useBrowse";
import { Anime } from "@/types";
import { useRouter } from "next/router";
import React from "react";

const BrowsePage = ({ query }) => {
  const {
    format = undefined,
    keyword = "",
    genre = undefined,
    season = undefined,
    seasonYear = undefined,
    sort = "popularity",
  } = query;

  const browseQuery: UseBrowseOptions = {
    format: format as string,
    keyword: keyword as string,
    genre: genre as string,
    season: season as string,
    seasonYear: seasonYear as string,
    sort: sort as keyof Anime,
  };

  return (
    <div className="py-20">
      <BrowseList title="Tìm kiếm" defaultQuery={browseQuery} />
    </div>
  );
};

BrowsePage.getInitialProps = ({ query }) => {
  return { query };
};

export default BrowsePage;

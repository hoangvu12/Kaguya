import BrowseList from "@/components/seldom/BrowseList";
import { UseBrowseOptions } from "@/hooks/useBrowse";
import React from "react";

const browseQuery: UseBrowseOptions = {
  format: "",
  keyword: "",
  genre: "",
  season: "",
  seasonYear: "",
  sort: "popularity",
};

const LatestPage = () => {
  return (
    <div className="py-20">
      <BrowseList title="Nổi bật hiện nay" defaultQuery={browseQuery} />
    </div>
  );
};

export default LatestPage;

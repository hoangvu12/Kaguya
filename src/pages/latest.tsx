import BrowseList from "@/components/seldom/BrowseList";
import { UseBrowseOptions } from "@/hooks/useBrowse";
import React from "react";

const browseQuery: UseBrowseOptions = {
  sort: "episodes_updated_at",
};

const LatestPage = () => {
  return (
    <div className="py-20">
      <BrowseList title="Mới cập nhật" defaultQuery={browseQuery} />
    </div>
  );
};

export default LatestPage;

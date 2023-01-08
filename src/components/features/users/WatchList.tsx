import Button from "@/components/shared/Button";
import useSourceList from "@/hooks/useSourceList";
import { SourceStatus } from "@/types";
import { MediaType } from "@/types/anilist";
import classNames from "classnames";
import React, { useState } from "react";

const STATUS = {
  ALL: "ALL",
  WATCHING: "WATCHING",
  PLANNING: "PLANNING",
  WATCHED: "WATCHED",
} as const;

type StatusType = typeof STATUS[keyof typeof STATUS];

interface WatchListProps {
  sourceStatus: SourceStatus<MediaType.Anime>[];
}

const WatchList: React.FC<WatchListProps> = ({ sourceStatus }) => {
  const { data: statusList, isLoading } = useSourceList(
    sourceStatus,
    MediaType.Anime
  );

  const [activeTab, setActiveTab] = useState<StatusType>(STATUS.ALL);

  const handleSetActiveTab = (tab: StatusType) => () => {
    setActiveTab(tab);
  };

  console.log(statusList);

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleSetActiveTab(STATUS.ALL)}
        className={classNames(
          STATUS.ALL === activeTab ? "!bg-primary-500" : "bg-background-700"
        )}
      >
        All
      </Button>
      <Button
        onClick={handleSetActiveTab(STATUS.WATCHING)}
        className={classNames(
          STATUS.WATCHING === activeTab
            ? "!bg-primary-500"
            : "bg-background-700"
        )}
      >
        Watching
      </Button>
      <Button
        onClick={handleSetActiveTab(STATUS.PLANNING)}
        className={classNames(
          STATUS.PLANNING === activeTab
            ? "!bg-primary-500"
            : "bg-background-700"
        )}
      >
        Planning
      </Button>
      <Button
        onClick={handleSetActiveTab(STATUS.WATCHED)}
        className={classNames(
          STATUS.WATCHED === activeTab ? "!bg-primary-500" : "bg-background-700"
        )}
      >
        Watched
      </Button>
    </div>
  );
};

export default React.memo(WatchList);

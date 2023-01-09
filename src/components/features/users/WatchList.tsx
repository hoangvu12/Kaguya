import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import Loading from "@/components/shared/Loading";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import useWatchList, { STATUS, Status } from "@/hooks/useWatchList";
import { AdditionalUser } from "@/types";
import { parseTime } from "@/utils";
import classNames from "classnames";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";

interface WatchListProps {
  user: AdditionalUser;
}

const WatchList: React.FC<WatchListProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<Status>(STATUS.All);

  const {
    data: watchList,
    isError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useWatchList(activeTab, user);

  const handleFetch = () => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNextPage();
  };

  const handleChangeTab = (status: Status) => () => {
    setActiveTab(status);
  };

  const totalData = useMemo(
    () => watchList?.pages.map((el) => el.data).flat(),
    [watchList?.pages]
  );

  return (
    <div>
      <div className="snap-x overflow-x-auto flex items-center gap-3">
        <Button
          className={classNames(
            activeTab === STATUS.All ? "bg-primary-600" : "bg-background-600"
          )}
          onClick={handleChangeTab(STATUS.All)}
        >
          All
        </Button>
        <Button
          className={classNames(
            activeTab === STATUS.Watching
              ? "bg-primary-600"
              : "bg-background-500"
          )}
          onClick={handleChangeTab(STATUS.Watching)}
        >
          Watching
        </Button>
        <Button
          className={classNames(
            activeTab === STATUS.Completed
              ? "bg-primary-600"
              : "bg-background-500"
          )}
          onClick={handleChangeTab(STATUS.Completed)}
        >
          Completed
        </Button>
        <Button
          className={classNames(
            activeTab === STATUS.Planning
              ? "bg-primary-600"
              : "bg-background-500"
          )}
          onClick={handleChangeTab(STATUS.Planning)}
        >
          Planned
        </Button>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="min-h-[2rem] w-full relative">
            <Loading />
          </div>
        ) : (
          <React.Fragment>
            <List data={totalData}>
              {(node) => {
                const durationTime = node.duration * 60;

                const watchProgressPercent =
                  durationTime === 0
                    ? 0
                    : (node.watchedTime / durationTime) * 100;

                const now = dayjs();

                const nextEpisodeAiringTime = !node.nextAiringEpisode
                  ? null
                  : dayjs.unix(node.nextAiringEpisode.airingAt);

                let nextEpisodeAiringTimeDuration = "";

                if (nextEpisodeAiringTime) {
                  nextEpisodeAiringTimeDuration = dayjs
                    .duration(nextEpisodeAiringTime.diff(now))
                    .format("D[d] H[h] m[m]");
                }

                const airedEpisodes = node.nextAiringEpisode
                  ? node.nextAiringEpisode.episode - 1
                  : null;

                return (
                  <Card
                    imageEndSlot={
                      <React.Fragment>
                        <div className="z-[5] flex flex-col justify-end absolute inset-0">
                          {node.nextAiringEpisode && (
                            <p className="ml-2 mb-1 px-1 py-0.5 rounded-md bg-background-700 w-max">
                              EP {node.nextAiringEpisode.episode}:{" "}
                              {nextEpisodeAiringTimeDuration}
                            </p>
                          )}

                          <div className="flex justify-between">
                            <p className="ml-2 mb-2 px-1 py-0.5 rounded-md bg-background-700">
                              {airedEpisodes
                                ? `${
                                    node.watchedEpisode
                                  } / ${airedEpisodes} / ${
                                    node.episodes || "??"
                                  }`
                                : `${node.watchedEpisode} / ${
                                    node.episodes || "??"
                                  }`}
                            </p>

                            <p className="mr-2 mb-2 px-1 py-0.5 rounded-md bg-background-700">
                              {parseTime(node.watchedTime)}
                            </p>
                          </div>

                          <div
                            className="h-1 bg-primary-500"
                            style={{ width: `${watchProgressPercent}%` }}
                          />
                        </div>

                        <div className="z-0 flex flex-col justify-end absolute inset-0">
                          <div className="h-32 bg-gradient-to-t from-black/80 to-transparent z-40"></div>
                        </div>
                      </React.Fragment>
                    }
                    data={node}
                  />
                );
              }}
            </List>

            {isFetchingNextPage && !isError && (
              <div className="mt-4">
                <ListSkeleton />
              </div>
            )}

            {((totalData.length && !isFetchingNextPage) || hasNextPage) && (
              <InView onInView={handleFetch} />
            )}

            {!hasNextPage && !!totalData.length && (
              <p className="mt-8 text-2xl text-center">
                There is nothing left...
              </p>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default WatchList;

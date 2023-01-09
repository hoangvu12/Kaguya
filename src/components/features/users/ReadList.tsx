import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import Loading from "@/components/shared/Loading";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import useReadList, { STATUS, Status } from "@/hooks/useReadList";
import { AdditionalUser } from "@/types";
import classNames from "classnames";
import React, { useMemo, useState } from "react";

interface ReadListProps {
  user: AdditionalUser;
}

const ReadList: React.FC<ReadListProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<Status>(STATUS.All);

  const {
    data: readList,
    isError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useReadList(activeTab, user);

  const handleFetch = () => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNextPage();
  };

  const handleChangeTab = (status: Status) => () => {
    setActiveTab(status);
  };

  const totalData = useMemo(
    () => readList?.pages.map((el) => el.data).flat(),
    [readList?.pages]
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
            activeTab === STATUS.Reading
              ? "bg-primary-600"
              : "bg-background-500"
          )}
          onClick={handleChangeTab(STATUS.Reading)}
        >
          Reading
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
                return (
                  <Card
                    imageEndSlot={
                      <React.Fragment>
                        <div className="z-[5] flex flex-col justify-end absolute inset-0">
                          <p className="w-max ml-2 mb-2 px-1 py-0.5 rounded-md bg-background-700">
                            {node.readChapter} / {node.chapters || "??"}
                          </p>
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

export default ReadList;

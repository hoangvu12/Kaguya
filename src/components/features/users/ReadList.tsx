import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import Loading from "@/components/shared/Loading";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import useReadList, { STATUS, Status } from "@/hooks/useReadList";
import { AdditionalUser } from "@/types";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import React, { useMemo, useState } from "react";

interface ReadListProps {
  user: AdditionalUser;
}

const ReadList: React.FC<ReadListProps> = ({ user }) => {
  const { READ_STATUS } = useConstantTranslation();

  type ReadStatus = typeof READ_STATUS[number];

  const getStatus = (status: Status) => {
    return READ_STATUS.find((watchStatus) => watchStatus.value === status);
  };

  const [activeTab, setActiveTab] = useState<ReadStatus>(
    getStatus(STATUS.Reading)
  );

  const { t } = useTranslation("common");

  const {
    data: readList,
    isError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useReadList(activeTab.value as Status, user);

  const handleFetch = () => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNextPage();
  };

  const handleChangeTab = (status: Status) => () => {
    setActiveTab(getStatus(status));
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
            activeTab.value === STATUS.Reading
              ? "bg-primary-600"
              : "bg-background-500"
          )}
          onClick={handleChangeTab(STATUS.Reading)}
        >
          {getStatus(STATUS.Reading).label}
        </Button>
        <Button
          className={classNames(
            activeTab.value === STATUS.Completed
              ? "bg-primary-600"
              : "bg-background-500"
          )}
          onClick={handleChangeTab(STATUS.Completed)}
        >
          {getStatus(STATUS.Completed).label}
        </Button>
        <Button
          className={classNames(
            activeTab.value === STATUS.Planning
              ? "bg-primary-600"
              : "bg-background-500"
          )}
          onClick={handleChangeTab(STATUS.Planning)}
        >
          {getStatus(STATUS.Planning).label}
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
                {t("no_list_results")}
              </p>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default ReadList;

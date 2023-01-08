import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import List from "@/components/shared/List";
import Loading from "@/components/shared/Loading";
import useReadList, { STATUS, Status } from "@/hooks/useReadList";
import { AdditionalUser, SourceStatus } from "@/types";
import { MediaType } from "@/types/anilist";
import classNames from "classnames";
import React, { useState } from "react";

interface ReadListProps {
  sourceStatus: SourceStatus<MediaType.Manga>[];
  user: AdditionalUser;
}

const ReadList: React.FC<ReadListProps> = ({ sourceStatus, user }) => {
  const [activeTab, setActiveTab] = useState<Status>(STATUS.All);

  const { data: readList, isLoading } = useReadList(
    sourceStatus,
    activeTab,
    user
  );

  const handleChangeTab = (status: Status) => () => {
    setActiveTab(status);
  };

  return (
    <div>
      <div className="flex items-center gap-3">
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
          <List data={readList}>
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
        )}
      </div>
    </div>
  );
};

export default ReadList;

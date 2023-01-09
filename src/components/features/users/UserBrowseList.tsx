import Input from "@/components/shared/Input";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import UserListSkeleton from "@/components/skeletons/UserListSkeleton";
import { UseBrowseOptions } from "@/hooks/useBrowseAnime";
import useUserSearch from "@/hooks/useUserSearch";
import { debounce } from "@/utils";
import { useTranslation } from "next-i18next";
import React, { useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import UserCard from "./UserCard";

interface UseBrowseListProps {
  defaultQuery?: UseBrowseOptions;
}

const UserBrowseList: React.FC<UseBrowseListProps> = ({ defaultQuery }) => {
  const [keyword, setKeyword] = useState(defaultQuery.keyword || "");
  const { t } = useTranslation();

  const {
    data: searchResult,
    isLoading: searchIsLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError: searchIsError,
  } = useUserSearch(keyword);

  const handleFetch = () => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNextPage();
  };

  const handleInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value),
    500
  );

  const totalData = useMemo(
    () => searchResult?.pages.flatMap((el) => el.data),
    [searchResult?.pages]
  );

  return (
    <div className="min-h-screen">
      <form className="space-y-4">
        <Input
          containerInputClassName="border border-white/80"
          LeftIcon={AiOutlineSearch}
          onChange={handleInputChange}
          defaultValue={keyword}
          label={t("common:search")}
          containerClassName="w-full md:w-96"
          placeholder="Username"
        />
      </form>

      <div className="mt-8">
        {keyword &&
          (!searchIsLoading ? (
            <React.Fragment>
              <List
                className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                data={totalData}
              >
                {(user) => <UserCard user={user} />}
              </List>

              {isFetchingNextPage && !searchIsError && (
                <div className="mt-4">
                  <UserListSkeleton />
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
          ) : (
            <UserListSkeleton />
          ))}
      </div>
    </div>
  );
};

export default UserBrowseList;

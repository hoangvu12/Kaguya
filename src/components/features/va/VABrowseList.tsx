import Input from "@/components/shared/Input";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import useBirthdayVA from "@/hooks/useBirthdayVA";
import { UseBrowseOptions } from "@/hooks/useBrowseAnime";
import useFavouriteVA from "@/hooks/useFavouriteVA";
import useVASearch from "@/hooks/useVASearch";
import { debounce } from "@/utils";
import { useTranslation } from "next-i18next";
import React, { useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import VACard from "./VACard";

interface BrowseListProps {
  defaultQuery?: UseBrowseOptions;
}

const BrowseList: React.FC<BrowseListProps> = ({ defaultQuery }) => {
  const [keyword, setKeyword] = useState(defaultQuery.keyword || "");
  const { t } = useTranslation();

  const {
    data: searchResult,
    isLoading: searchIsLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError: searchIsError,
  } = useVASearch(keyword);

  const { data: birthdayVoiceActors, isLoading: birthdayIsLoading } =
    useBirthdayVA();
  const { data: favouritesVoiceActors, isLoading: favouritesIsLoading } =
    useFavouriteVA();

  const handleFetch = () => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNextPage();
  };

  const handleInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value),
    500
  );

  const totalData = useMemo(
    () => searchResult?.pages.flatMap((el) => el.staff),
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
          placeholder={t("common:voice_actor_name")}
        />
      </form>

      <div className="mt-8">
        {keyword ? (
          !searchIsLoading ? (
            <React.Fragment>
              <List data={totalData}>
                {(voiceActor) => <VACard voiceActor={voiceActor} />}
              </List>

              {isFetchingNextPage && !searchIsError && (
                <div className="mt-4">
                  <ListSkeleton />
                </div>
              )}

              {((totalData.length && !isFetchingNextPage) || hasNextPage) && (
                <InView onInView={handleFetch} />
              )}

              {!hasNextPage && !!totalData.length && (
                <p className="mt-8 text-2xl text-center">Hết rồi...</p>
              )}
            </React.Fragment>
          ) : (
            <ListSkeleton />
          )
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">{t("common:birthday")}</h2>

              {birthdayIsLoading ? (
                <ListSkeleton />
              ) : (
                <List data={birthdayVoiceActors}>
                  {(voiceActor) => <VACard voiceActor={voiceActor} />}
                </List>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">
                {" "}
                {t("common:most_favourite")}
              </h2>

              {favouritesIsLoading ? (
                <ListSkeleton />
              ) : (
                <List data={favouritesVoiceActors}>
                  {(voiceActor) => <VACard voiceActor={voiceActor} />}
                </List>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseList;

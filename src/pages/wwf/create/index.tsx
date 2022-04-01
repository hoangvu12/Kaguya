import Card from "@/components/shared/Card";
import Head from "@/components/shared/Head";
import Input from "@/components/shared/Input";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import Section from "@/components/shared/Section";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import useBrowseAnime from "@/hooks/useBrowseAnime";
import { debounce } from "@/utils";
import React, { useCallback, useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const ChooseAnimePage = () => {
  const [keyword, setKeyword] = useState("");

  const {
    data,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
  } = useBrowseAnime({ keyword, sort: "episodeUpdatedAt" });

  const handleFetch = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value),
    500
  );

  const totalData = useMemo(
    () => data?.pages.map((el) => el.data).flat(),
    [data?.pages]
  );

  return (
    <Section className="py-20">
      <Head
        title="Tạo phòng (chọn Anime) - Kaguya"
        description="Chọn Anime để tạo phòng xem cùng với bạn bè tại Kaguya"
      />

      <h1 className="text-4xl font-semibold mb-8">Chọn Anime để tạo phòng</h1>

      <Input
        containerInputClassName="border border-white/80"
        LeftIcon={AiOutlineSearch}
        onChange={handleInputChange}
        defaultValue={keyword}
        label="Tìm kiếm"
        containerClassName="w-full md:w-1/3 mb-8"
      />

      {!isLoading ? (
        <React.Fragment>
          <List data={totalData}>
            {(data) => (
              <Card
                data={data}
                type="anime"
                redirectUrl={`/wwf/create/${data.id}`}
              />
            )}
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
            <p className="mt-8 text-2xl text-center">Hết rồi...</p>
          )}
        </React.Fragment>
      ) : (
        <ListSkeleton />
      )}
    </Section>
  );
};

export default ChooseAnimePage;

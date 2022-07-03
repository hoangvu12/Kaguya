import UploadContainer from "@/components/features/upload/UploadContainer";
import UploadLayout from "@/components/layouts/UploadLayout";
import Card from "@/components/shared/Card";
import Head from "@/components/shared/Head";
import Input from "@/components/shared/Input";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import withAdditionalUser from "@/hocs/withAdditionalUser";
import useBrowseManga from "@/hooks/useBrowseManga";
import { AdditionalUser } from "@/types";
import { MediaSort } from "@/types/anilist";
import { debounce } from "@/utils";
import { useTranslation } from "next-i18next";
import React, { useCallback, useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface Props {
  user: AdditionalUser;
}

const CreateUploadMangaPage: React.FC<Props> = ({ user }) => {
  const [keyword, setKeyword] = useState("");
  const { t } = useTranslation("wwf");

  const {
    data,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
  } = useBrowseManga({ keyword, sort: MediaSort.Trending_desc });

  const handleFetch = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value),
    500
  );

  const totalData = useMemo(
    () => data?.pages.flatMap((el) => el.media),
    [data?.pages]
  );

  return (
    <UploadContainer isVerified={user.isVerified}>
      <Head title="Manga" />

      <h1 className="text-4xl font-semibold mb-8">Manga</h1>

      <Input
        containerInputClassName="border border-white/80"
        LeftIcon={AiOutlineSearch}
        onChange={handleInputChange}
        defaultValue={keyword}
        label={t("common:search")}
        containerClassName="w-full md:w-1/3 mb-8"
      />

      {!isLoading ? (
        <React.Fragment>
          <List data={totalData}>
            {(data) => (
              <Card data={data} redirectUrl={`/upload/manga/${data.id}`} />
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
    </UploadContainer>
  );
};

export default CreateUploadMangaPage;

export const getServerSideProps = withAdditionalUser();

// @ts-ignore
CreateUploadMangaPage.getLayout = (children) => (
  <UploadLayout>{children}</UploadLayout>
);

import ReadPage from "@/components/features/manga/ReadPage";
import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Loading from "@/components/shared/Loading";
import { REVALIDATE_TIME } from "@/constants";
import useChapters from "@/hooks/useChapters";
import { getMediaDetails } from "@/services/anilist";
import { Media, MediaType } from "@/types/anilist";
import { getDescription, getTitle } from "@/utils/data";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

interface ReadPageContainerProps {
  media: Media;
}

const ReadPageContainer: NextPage<ReadPageContainerProps> = ({ media }) => {
  const { data: chapters, isLoading } = useChapters(media.id);
  const { locale, back } = useRouter();
  const { t } = useTranslation("manga_read");

  const title = useMemo(() => getTitle(media, locale), [media, locale]);
  const description = useMemo(
    () => getDescription(media, locale),
    [media, locale]
  );

  const hasChapters = useMemo(() => chapters?.length > 0, [chapters]);

  return (
    <React.Fragment>
      <Head
        title={`${title} - Kaguya`}
        description={`${description} - ${t("head_description", {
          title,
        })}`}
        image={media.bannerImage || media.coverImage.extraLarge}
      />
      {isLoading ? (
        <div className="flex relative w-full min-h-screen">
          <Loading />
        </div>
      ) : !hasChapters ? (
        <div className="flex flex-col items-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 space-y-4">
          <p className="text-4xl font-semibold text-center">｡゜(｀Д´)゜｡</p>

          <p className="text-xl text-center">
            {t("error_message", {
              error: t("no_chapters_message"),
            })}
          </p>

          <Button className="w-[max-content]" primary onClick={back}>
            {t("error_goback")}
          </Button>
        </div>
      ) : (
        <ReadPage chapters={chapters} media={media} />
      )}
    </React.Fragment>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { params },
}) => {
  try {
    const media = await getMediaDetails({
      type: MediaType.Manga,
      id: Number(params[0]),
    });

    return {
      props: {
        media,
      },
      revalidate: REVALIDATE_TIME,
    };
  } catch (err) {
    console.log(err);

    return { notFound: true, revalidate: REVALIDATE_TIME };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

// @ts-ignore
ReadPageContainer.getLayout = (page) => page;

export default ReadPageContainer;

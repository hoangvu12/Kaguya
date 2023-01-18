import WatchPage from "@/components/features/anime/WatchPage";
import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Loading from "@/components/shared/Loading";
import { REVALIDATE_TIME } from "@/constants";
import useEpisodes from "@/hooks/useEpisodes";
import { getMediaDetails } from "@/services/anilist";
import { Media, MediaType } from "@/types/anilist";
import { getDescription, getTitle } from "@/utils/data";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

interface WatchPageContainerProps {
  media: Media;
}

const WatchPageContainer: NextPage<WatchPageContainerProps> = ({ media }) => {
  const { data: episodes, isLoading } = useEpisodes(media.id);
  const { locale, back } = useRouter();

  const title = useMemo(() => getTitle(media, locale), [media, locale]);
  const description = useMemo(
    () => getDescription(media, locale),
    [media, locale]
  );

  const hasEpisodes = useMemo(() => episodes?.length > 0, [episodes]);

  return (
    <React.Fragment>
      <Head
        title={`${title} - Kaguya`}
        description={`${description}. Watch ${title} online for free.`}
        image={media.bannerImage}
      />
      {isLoading ? (
        <div className="flex relative w-full min-h-screen">
          <Loading />
        </div>
      ) : !hasEpisodes ? (
        <div className="flex flex-col items-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 space-y-4">
          <p className="text-4xl font-semibold text-center">｡゜(｀Д´)゜｡</p>
          <p className="text-xl text-center">
            Something went wrong (There are no episodes)
          </p>
          <Button className="w-[max-content]" primary onClick={back}>
            Go back
          </Button>
        </div>
      ) : (
        <WatchPage episodes={episodes} media={media} />
      )}
    </React.Fragment>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { params },
}) => {
  try {
    const media = await getMediaDetails({
      type: MediaType.Anime,
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
WatchPageContainer.getLayout = (page) => page;

export default WatchPageContainer;

import Card from "@/components/shared/Card";
import DetailsSection from "@/components/shared/DetailsSection";
import Head from "@/components/shared/Head";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import Section from "@/components/shared/Section";
import TextIcon from "@/components/shared/TextIcon";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import { REVALIDATE_TIME } from "@/constants";
import withRedirect from "@/hocs/withRedirect";
import { useStudio } from "@/hooks/useStudio";
import { getStudioDetails } from "@/services/anilist";
import { Studio } from "@/types/anilist";
import { groupBy, numberWithCommas, vietnameseSlug } from "@/utils";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useMemo } from "react";
import { AiFillHeart } from "react-icons/ai";

interface DetailsPageProps {
  studio: Studio;
}

const DetailsPage: NextPage<DetailsPageProps> = ({ studio: initialStudio }) => {
  const {
    data: studio,
    isFetchingNextPage,
    isError,
    hasNextPage,
    fetchNextPage,
  } = useStudio(initialStudio.id, initialStudio);

  const anime = useMemo(
    () =>
      groupBy(
        studio.pages
          .flatMap((page) => page.media.nodes)
          .filter((media) => media?.startDate?.year),
        (media) => media?.startDate?.year.toString()
      ),
    [studio.pages]
  );

  const handleFetch = () => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNextPage();
  };

  return (
    <>
      <Head title={`${initialStudio.name} - Kaguya`} />

      <div className="pb-8">
        <Section className="pt-24 px-4 sm:px-12 z-10 pb-4 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <h1 className="text-3xl font-semibold">{initialStudio.name}</h1>

            <TextIcon iconClassName="text-primary-500" LeftIcon={AiFillHeart}>
              <p>{numberWithCommas(initialStudio.favourites)}</p>
            </TextIcon>
          </div>
        </Section>

        <Section className="px-4 sm:px-12">
          {/* Using flex column reverse because the object is not sortable */}
          <div className="flex flex-col-reverse gap-y-8">
            {Object.entries(anime).map(([year, medias]) => (
              <DetailsSection title={year} key={year}>
                <List data={medias}>
                  {(media) => <Card data={media} key={media.id} />}
                </List>
              </DetailsSection>
            ))}
          </div>

          {isFetchingNextPage && !isError && (
            <div className="mt-4">
              <ListSkeleton />
            </div>
          )}

          {((anime.length && !isFetchingNextPage) || hasNextPage) && (
            <InView onInView={handleFetch} />
          )}

          {!hasNextPage && !!anime.length && (
            <p className="mt-8 text-2xl text-center">Hết rồi...</p>
          )}
        </Section>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { params },
}) => {
  try {
    const data = await getStudioDetails({
      id: Number(params[0]),
      perPage: 50,
    });

    return {
      props: {
        studio: data,
      },
      revalidate: REVALIDATE_TIME,
    };
  } catch (error) {
    console.log(error);

    return { notFound: true, revalidate: REVALIDATE_TIME };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export default withRedirect(DetailsPage, (router, props) => {
  const { params } = router.query;
  const [id, slug] = params as string[];

  if (slug) return null;

  return {
    url: `/studios/${id}/${vietnameseSlug(props.studio.name)}`,
    options: {
      shallow: true,
    },
  };
});

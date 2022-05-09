import Card from "@/components/shared/Card";
import DetailsSection from "@/components/shared/DetailsSection";
import Head from "@/components/shared/Head";
import List from "@/components/shared/List";
import TextIcon from "@/components/shared/TextIcon";
import { REVALIDATE_TIME } from "@/constants";
import withRedirect from "@/hocs/withRedirect";
import supabase from "@/lib/supabase";
import { Studio, StudioConnection } from "@/types";
import { groupBy, numberWithCommas, vietnameseSlug } from "@/utils";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React, { useMemo } from "react";
import { AiFillHeart } from "react-icons/ai";

interface AdvancedStudio extends Studio {
  animeConnections: StudioConnection[];
}

interface DetailsPageProps {
  studio: AdvancedStudio;
}

const DetailsPage: NextPage<DetailsPageProps> = ({ studio }) => {
  const anime = useMemo(
    () =>
      groupBy(
        studio.animeConnections
          .flatMap((connection) => connection?.media)
          .filter((media) => media?.startDate?.year),
        (media) => media?.startDate?.year.toString()
      ),
    [studio.animeConnections]
  );

  return (
    <>
      <Head title={`${studio.name} - Kaguya`} />

      <div className="pb-8">
        <div className="pt-24 px-4 sm:px-12 z-10 pb-4 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <h1 className="text-3xl font-semibold">{studio.name}</h1>

            <TextIcon iconClassName="text-primary-500" LeftIcon={AiFillHeart}>
              <p>{numberWithCommas(studio.favourites)}</p>
            </TextIcon>
          </div>
        </div>

        {/* Using flex column reverse because the object is not sortable */}
        <div className="flex flex-col-reverse px-4 sm:px-12 gap-y-8">
          {Object.entries(anime).map(([year, medias]) => (
            <DetailsSection title={year} key={year}>
              <List data={medias}>
                {(media) => <Card type="anime" data={media} key={media.id} />}
              </List>
            </DetailsSection>
          ))}
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { params },
}) => {
  const { data, error } = await supabase
    .from<Studio>("kaguya_studios")
    .select(
      `
        *,
        animeConnections:kaguya_studio_connections!studioId(media:mediaId(*))
      `
    )
    .eq("id", Number(params[0]))
    .single();

  if (error) {
    console.log(error);

    return { notFound: true, revalidate: REVALIDATE_TIME };
  }

  return {
    props: {
      studio: data as AdvancedStudio,
    },
    revalidate: REVALIDATE_TIME,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await supabase
    .from<Studio>("kaguya_studios")
    .select("id")
    .order("favourites", { ascending: false })
    .limit(1);

  const paths = data.map((studio) => ({
    params: { params: [studio.id.toString()] },
  }));

  return { paths, fallback: "blocking" };
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

import CharacterCard from "@/components/seldom/CharacterCard";
import DetailsBanner from "@/components/seldom/DetailsBanner";
import DetailsSection from "@/components/seldom/DetailsSection";
import InfoItem from "@/components/seldom/InfoItem";
import List from "@/components/shared/List";
import Button from "@/components/shared/Button";
import DotList from "@/components/shared/DotList";
import Head from "@/components/shared/Head";
import PlainCard from "@/components/shared/PlainCard";
import { REVALIDATE_TIME } from "@/constants";
import supabase from "@/lib/supabase";
import { Manga } from "@/types";
import { numberWithCommas } from "@/utils";
import { convert } from "@/utils/data";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { BsFillPlayFill } from "react-icons/bs";

interface DetailsPageProps {
  manga: Manga;
}

const DetailsPage: NextPage<DetailsPageProps> = ({ manga }) => {
  const router = useRouter();

  const handleReadClick = () => {
    router.push(`/manga/read/${manga.ani_id}`);
  };

  return (
    <>
      <Head
        title={`${manga.title} - Kaguya`}
        description={manga.description}
        image={manga.banner_image}
      />

      <div className="pb-8">
        <DetailsBanner image={manga.banner_image} />

        <div className="relative px-4 sm:px-12 z-10 bg-background-900 pb-4">
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="flex-shrink-0 relative left-1/2 -translate-x-1/2 md:static md:left-0 md:-translate-x-0 w-[186px] -mt-20">
              <PlainCard data={manga} />
            </div>

            <div className="text-center md:text-left flex flex-col items-center md:items-start py-4 mt-4 md:-mt-16">
              <Button
                primary
                LeftIcon={BsFillPlayFill}
                className="mb-8"
                onClick={handleReadClick}
              >
                <p>Đọc ngay</p>
              </Button>

              <p className="text-3xl font-semibold mb-2">{manga.title}</p>

              <DotList>
                {manga.genres.map((genre) => (
                  <p key={genre}>{convert(genre, "genre")}</p>
                ))}
              </DotList>

              <p className="mt-4 text-gray-300 mb-8">{manga.description}</p>

              <div className="flex overflow-x-auto md:scroll-bar snap-x space-x-8 md:space-x-16">
                <InfoItem title="Quốc gia" value={manga.country_of_origin} />

                <InfoItem
                  title="Tình trạng"
                  value={convert(manga.status, "status")}
                />

                <InfoItem
                  title="Giới hạn tuổi"
                  value={manga.is_adult ? "18+" : ""}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 md:space-y-0 px-4 md:grid md:grid-cols-10 w-full min-h-screen mt-8 sm:px-12 gap-8">
          <div className="md:col-span-2 bg-background-900 rounded-md p-4 space-y-4 h-[max-content]">
            <InfoItem
              title="Nổi bật"
              value={numberWithCommas(manga.popularity)}
            />
            <InfoItem
              title="Yêu thích"
              value={numberWithCommas(manga.favourites)}
            />
            <InfoItem
              title="Xu hướng"
              value={numberWithCommas(manga.trending)}
            />
          </div>
          <div className="md:col-span-8 space-y-12">
            {!!manga?.characters?.length && (
              <DetailsSection
                title="Nhân vật"
                className="w-full grid md:grid-cols-2 grid-cols-1 gap-4"
              >
                {manga.characters.map((character, index) => (
                  <CharacterCard character={character} key={index} />
                ))}
              </DetailsSection>
            )}

            {!!manga?.relations?.length && (
              <DetailsSection title="Manga liên quan">
                <List
                  data={manga.relations.map((relation) => relation.manga)}
                  type="manga"
                />
              </DetailsSection>
            )}

            {!!manga?.recommendations?.length && (
              <DetailsSection title="Manga hay khác">
                <List
                  data={manga.recommendations.map(
                    (recommendation) => recommendation.manga
                  )}
                  type="manga"
                />
              </DetailsSection>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data, error } = await supabase
    .from("manga")
    .select(
      `
        *,
        characters:manga_characters(*),
        recommendations:manga_recommendations!original_id(manga:recommend_id(*)),
        relations:manga_relations!original_id(manga:relation_id(*))
      `
    )
    .eq("ani_id", Number(params.id))
    .single();

  if (error) {
    return { notFound: true };
  }

  return {
    props: {
      manga: data as Manga,
    },
    revalidate: REVALIDATE_TIME,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await supabase
    .from<Manga>("manga")
    .select("ani_id")
    .order("updated_at", { ascending: false })
    .limit(200);

  const paths = data.map((manga) => ({
    params: { id: manga.ani_id.toString() },
  }));

  return { paths, fallback: "blocking" };
};

export default DetailsPage;

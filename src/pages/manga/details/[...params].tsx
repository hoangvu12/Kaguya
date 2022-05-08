import CommentsSection from "@/components/features/comment/CommentsSection";
import LocaleChapterSelector from "@/components/features/manga/LocaleChapterSelector";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import CharacterConnectionCard from "@/components/shared/CharacterConnectionCard";
import Description from "@/components/shared/Description";
import DetailsBanner from "@/components/shared/DetailsBanner";
import DetailsSection from "@/components/shared/DetailsSection";
import DotList from "@/components/shared/DotList";
import Head from "@/components/shared/Head";
import InfoItem from "@/components/shared/InfoItem";
import List from "@/components/shared/List";
import MediaDescription from "@/components/shared/MediaDescription";
import NotificationButton from "@/components/shared/NotificationButton";
import PlainCard from "@/components/shared/PlainCard";
import SourceStatus from "@/components/shared/SourceStatus";
import Spinner from "@/components/shared/Spinner";
import { REVALIDATE_TIME } from "@/constants";
import { useUser } from "@/contexts/AuthContext";
import withRedirect from "@/hocs/withRedirect";
import useChapters from "@/hooks/useChapters";
import supabase from "@/lib/supabase";
import { Manga } from "@/types";
import { numberWithCommas, vietnameseSlug } from "@/utils";
import { convert, getDescription, getTitle } from "@/utils/data";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { BsFillPlayFill } from "react-icons/bs";

interface DetailsPageProps {
  manga: Manga;
}

const DetailsPage: NextPage<DetailsPageProps> = ({ manga }) => {
  const user = useUser();
  const { locale } = useRouter();
  const { t } = useTranslation("manga_details");
  const { data: chapters, isLoading, isError } = useChapters(manga.id);

  const title = useMemo(() => getTitle(manga, locale), [manga, locale]);
  const description = useMemo(
    () => getDescription(manga, locale),
    [manga, locale]
  );

  return (
    <>
      <Head
        title={`${title} - Kaguya`}
        description={description}
        image={manga.bannerImage}
      />

      <div className="pb-8">
        <DetailsBanner image={manga.bannerImage} />

        <div className="relative px-4 sm:px-12 z-10 bg-background-900 pb-4">
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="shrink-0 relative left-1/2 -translate-x-1/2 md:static md:left-0 md:-translate-x-0 w-[186px] -mt-20 space-y-6">
              <PlainCard src={manga.coverImage.extraLarge} alt={title} />

              {user && (
                <div className="flex items-center space-x-1">
                  <SourceStatus type="manga" source={manga} />
                  <NotificationButton type="manga" source={manga} />
                </div>
              )}
            </div>

            <div className="justify-between text-center md:text-left flex flex-col items-center md:items-start py-4 mt-4 md:-mt-16 space-y-4">
              <div className="flex flex-col md:items-start items-center space-y-4">
                <Link href={`/manga/read/${manga.id}`}>
                  <a>
                    <Button primary LeftIcon={BsFillPlayFill} className="mb-4">
                      <p>{t("read_now")}</p>
                    </Button>
                  </a>
                </Link>

                <p className="text-3xl font-semibold mb-2">{title}</p>

                <DotList>
                  {manga.genres.map((genre) => (
                    <span key={genre}>
                      {convert(genre, "genre", { locale })}
                    </span>
                  ))}
                </DotList>

                <MediaDescription
                  description={description}
                  containerClassName="mt-4 mb-8"
                  className="text-gray-300 hover:text-gray-100 transition duration-300"
                />
              </div>

              <div className="flex overflow-x-auto md:scroll-bar snap-x space-x-8 md:space-x-16">
                <InfoItem
                  title={t("common:country")}
                  value={manga.countryOfOrigin}
                />

                <InfoItem
                  title={t("common:status")}
                  value={convert(manga.status, "status", { locale })}
                />

                <InfoItem
                  title={t("total_chapters")}
                  value={manga.totalChapters}
                />

                <InfoItem
                  title={t("common:age_rated")}
                  value={manga.isAdult ? "18+" : ""}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 md:space-y-0 px-4 md:grid md:grid-cols-10 w-full min-h-screen mt-8 sm:px-12 gap-8">
          <div className="md:col-span-2 h-[max-content] space-y-4">
            <div className="bg-background-900 rounded-md p-4 space-y-4">
              <InfoItem title="English" value={manga.title.english} />
              <InfoItem title="Native" value={manga.title.native} />
              <InfoItem title="Romanji" value={manga.title.romaji} />
              <InfoItem
                title={t("common:popular")}
                value={numberWithCommas(manga.popularity)}
              />
              <InfoItem
                title={t("common:favourite")}
                value={numberWithCommas(manga.favourites)}
              />
              <InfoItem
                title={t("common:trending")}
                value={numberWithCommas(manga.trending)}
              />

              <InfoItem
                title={t("common:synonyms")}
                value={manga.synonyms.join("\n")}
              />
            </div>

            <div className="space-y-2 text-gray-400">
              <h1 className="font-semibold">Tags</h1>

              <ul className="space-y-2">
                {manga.tags.map((tag) => (
                  <Link href={`/browse?type=manga&tags=${tag}`} key={tag}>
                    <a className="block">
                      <li className="p-2 rounded-md bg-background-900 hover:text-primary-300 transition duration-300">
                        {tag}
                      </li>
                    </a>
                  </Link>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-8 space-y-12">
            <DetailsSection title={t("chapters_section")} className="relative">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <LocaleChapterSelector mediaId={manga.id} chapters={chapters} />
              )}
            </DetailsSection>

            {!!manga?.characters?.length && (
              <DetailsSection
                title={t("characters_section")}
                className="w-full grid md:grid-cols-2 grid-cols-1 gap-4"
              >
                {manga.characters.map((character, index) => (
                  <CharacterConnectionCard
                    type="manga"
                    characterConnection={character}
                    key={index}
                  />
                ))}
              </DetailsSection>
            )}

            {!!manga?.relations?.length && (
              <DetailsSection title={t("relations_section")}>
                <List data={manga.relations.map((relation) => relation.media)}>
                  {(manga) => <Card type="manga" data={manga} />}
                </List>
              </DetailsSection>
            )}

            {!!manga?.recommendations?.length && (
              <DetailsSection title={t("recommendations_section")}>
                <List
                  data={manga.recommendations.map(
                    (recommendation) => recommendation.media
                  )}
                >
                  {(manga) => <Card type="manga" data={manga} />}
                </List>
              </DetailsSection>
            )}

            <DetailsSection title={t("comments_section")}>
              <CommentsSection manga_id={manga.id} />
            </DetailsSection>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { params },
}) => {
  const { data, error } = await supabase
    .from("kaguya_manga")
    .select(
      `
        *,
        characters:kaguya_manga_characters!mediaId(*, character:characterId(*)),
        recommendations:kaguya_manga_recommendations!originalId(media:recommendationId(*)),
        relations:kaguya_manga_relations!originalId(media:relationId(*)),
        sourceConnections:kaguya_manga_source!mediaId(*, chapters:kaguya_chapters(*, source:kaguya_sources(id, name, locales)))
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
      manga: data as Manga,
    },
    revalidate: REVALIDATE_TIME,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await supabase
    .from<Manga>("kaguya_manga")
    .select("id")
    .order("trending", { ascending: false })
    .limit(5);

  const paths = data.map((manga) => ({
    params: { params: [manga.id.toString()] },
  }));

  return { paths, fallback: "blocking" };
};

export default withRedirect(DetailsPage, (router, props) => {
  const { params } = router.query;
  const [id, slug] = params as string[];
  const title = getTitle(props.manga, router.locale);

  if (slug) return null;

  return {
    url: `/manga/details/${id}/${vietnameseSlug(title)}`,
    options: {
      shallow: true,
    },
  };
});

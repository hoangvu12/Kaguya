import Comments from "@/components/features/comment/Comments";
import LocaleChapterSelector from "@/components/features/manga/LocaleChapterSelector";
import AddTranslationModal from "@/components/shared/AddTranslationModal";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import CharacterConnectionCard from "@/components/shared/CharacterConnectionCard";
import CircleButton from "@/components/shared/CircleButton";
import DetailsBanner from "@/components/shared/DetailsBanner";
import DetailsSection from "@/components/shared/DetailsSection";
import DotList from "@/components/shared/DotList";
import Head from "@/components/shared/Head";
import InfoItem from "@/components/shared/InfoItem";
import List from "@/components/shared/List";
import MediaDescription from "@/components/shared/MediaDescription";
import NotificationButton from "@/components/shared/NotificationButton";
import PlainCard from "@/components/shared/PlainCard";
import Popup from "@/components/shared/Popup";
import Section from "@/components/shared/Section";
import SourceStatus from "@/components/shared/SourceStatus";
import Spinner from "@/components/shared/Spinner";
import { REVALIDATE_TIME } from "@/constants";
import withRedirect from "@/hocs/withRedirect";
import useChapters from "@/hooks/useChapters";
import { getMediaDetails } from "@/services/anilist";
import { Translation } from "@/types";
import { Media, MediaType } from "@/types/anilist";
import { numberWithCommas, vietnameseSlug } from "@/utils";
import { convert, getDescription, getTitle } from "@/utils/data";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import classNames from "classnames";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { isMobile } from "react-device-detect";
import { AiOutlineUpload } from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsFillPlayFill } from "react-icons/bs";

interface DetailsPageProps {
  manga: Media;
}

const DetailsPage: NextPage<DetailsPageProps> = ({ manga }) => {
  const { user } = useUser();
  const { locale } = useRouter();
  const { t } = useTranslation("manga_details");
  const { data: chapters, isLoading } = useChapters(manga.id);

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

        <Section className="relative z-10 bg-background-900 pb-4">
          <div className="flex md:space-x-8">
            <div className="shrink-0 relative md:static md:left-0 md:-translate-x-0 w-[120px] md:w-[186px] -mt-20 space-y-6">
              <PlainCard src={manga.coverImage.extraLarge} alt={title} />

              {user && !isMobile && (
                <div className="flex items-center space-x-1">
                  <SourceStatus type="manga" source={manga} />
                  <NotificationButton type="manga" source={manga} />
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between md:py-4 ml-4 text-left items-start md:-mt-16 space-y-4">
              <div className="flex flex-col items-start space-y-4 md:no-scrollbar">
                <div className="hidden md:flex items-center flex-wrap gap-2 mb-4">
                  <Link href={`/manga/read/${manga.id}`}>
                    <a>
                      <Button primary LeftIcon={BsFillPlayFill}>
                        <p>{t("read_now")}</p>
                      </Button>
                    </a>
                  </Link>

                  <Popup
                    reference={
                      <Button
                        className="!bg-[#393a3b]"
                        LeftIcon={BiDotsHorizontalRounded}
                      ></Button>
                    }
                    placement="bottom"
                    type="click"
                    className="space-y-2"
                  >
                    <Link href={`/upload/manga/${manga.id}`}>
                      <a>
                        <Button
                          secondary
                          className="w-full"
                          LeftIcon={AiOutlineUpload}
                        >
                          <p>Upload</p>
                        </Button>
                      </a>
                    </Link>

                    <AddTranslationModal
                      mediaId={manga.id}
                      mediaType={MediaType.Manga}
                      defaultDescription={description}
                      defaultTitle={title}
                    />
                  </Popup>
                </div>

                <p className="text-2xl md:text-3xl font-semibold mb-2">
                  {title}
                </p>

                <DotList>
                  {manga.genres.map((genre) => (
                    <span key={genre}>
                      {convert(genre, "genre", { locale })}
                    </span>
                  ))}
                </DotList>

                <MediaDescription
                  description={description}
                  containerClassName="mt-4 mb-8 hidden md:block"
                  className="text-gray-300 hover:text-gray-100 transition duration-300"
                />

                {/* MAL-Sync UI */}
                <div id="hidden mal-sync"></div>
              </div>

              <div className="hidden md:flex gap-x-8 overflow-x-auto md:gap-x-16 [&>*]:shrink-0">
                <InfoItem
                  title={t("common:country")}
                  value={manga.countryOfOrigin}
                />

                <InfoItem
                  title={t("common:status")}
                  value={convert(manga.status, "status", { locale })}
                />

                <InfoItem title={t("total_chapters")} value={manga.chapters} />

                <InfoItem
                  title={t("common:age_rated")}
                  value={manga.isAdult ? "18+" : ""}
                />
              </div>
            </div>
          </div>

          <MediaDescription
            description={description}
            containerClassName="my-4 block md:hidden"
            className="text-gray-300 hover:text-gray-100 transition duration-300"
          />

          <div className="flex md:hidden items-center space-x-2 mb-4">
            {user && isMobile && <SourceStatus type="manga" source={manga} />}

            <Link href={`/manga/read/${manga.id}`}>
              <a className={classNames(!user && "flex-1")}>
                {user ? (
                  <CircleButton secondary LeftIcon={BsFillPlayFill} />
                ) : (
                  <Button
                    primary
                    LeftIcon={BsFillPlayFill}
                    className="relative w-full"
                  >
                    <p className="!mx-0 absolute left-1/2 -translate-x-1/2">
                      {t("read_now")}
                    </p>
                  </Button>
                )}
              </a>
            </Link>

            {user && isMobile && (
              <NotificationButton type="manga" source={manga} />
            )}

            <Popup
              reference={
                <CircleButton secondary LeftIcon={BiDotsHorizontalRounded} />
              }
              placement="bottom"
              type="click"
              className="space-y-2"
            >
              <AddTranslationModal
                mediaId={manga.id}
                mediaType={MediaType.Manga}
                defaultDescription={description}
                defaultTitle={title}
              />

              <Link href={`/upload/manga/${manga.id}`}>
                <a>
                  <Button
                    secondary
                    className="w-full"
                    LeftIcon={AiOutlineUpload}
                  >
                    <p>Upload</p>
                  </Button>
                </a>
              </Link>
            </Popup>
          </div>

          <div className="md:hidden flex gap-x-8 overflow-x-auto md:gap-x-16 [&>*]:shrink-0">
            <InfoItem
              title={t("common:country")}
              value={manga.countryOfOrigin}
            />

            <InfoItem
              title={t("common:status")}
              value={convert(manga.status, "status", { locale })}
            />

            <InfoItem title={t("total_chapters")} value={manga.chapters} />

            <InfoItem
              title={t("common:age_rated")}
              value={manga.isAdult ? "18+" : ""}
            />
          </div>
        </Section>

        <Section className="w-full min-h-screen gap-8 mt-2 md:mt-8 space-y-8 md:space-y-0 md:grid md:grid-cols-10 sm:px-12">
          <div className="md:col-span-2 h-[max-content] space-y-4">
            <div className="flex flex-row md:flex-col overflow-x-auto bg-background-900 rounded-md gap-4 [&>*]:shrink-0 md:no-scrollbar">
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

              <ul className="overflow-x-auto flex flex-row md:flex-col gap-2 [&>*]:shrink-0 md:no-scrollbar">
                {manga.tags.map((tag) => (
                  <Link
                    href={{
                      pathname: "/browse",
                      query: { type: "manga", tags: tag.name },
                    }}
                    key={tag.id}
                  >
                    <a className="block">
                      <li className="p-2 rounded-md bg-background-900 hover:text-primary-300 transition duration-300">
                        {tag.name}
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

            {!!manga?.characters?.edges.length && (
              <DetailsSection
                title={t("characters_section")}
                className="w-full grid md:grid-cols-2 grid-cols-1 gap-4"
              >
                {manga.characters.edges.map((characterEdge, index) => (
                  <CharacterConnectionCard
                    characterEdge={characterEdge}
                    key={index}
                  />
                ))}
              </DetailsSection>
            )}

            {!!manga?.relations?.nodes?.length && (
              <DetailsSection title={t("relations_section")}>
                <List data={manga.relations.nodes}>
                  {(node) => <Card data={node} />}
                </List>
              </DetailsSection>
            )}

            {!!manga?.recommendations?.nodes.length && (
              <DetailsSection title={t("recommendations_section")}>
                <List
                  data={manga.recommendations.nodes.map(
                    (node) => node.mediaRecommendation
                  )}
                >
                  {(node) => <Card data={node} />}
                </List>
              </DetailsSection>
            )}

            <DetailsSection title={t("comments_section")}>
              <Comments topic={`manga-${manga.id}`} />
            </DetailsSection>
          </div>
        </Section>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { params },
}) => {
  try {
    const { data: isDMCA } = await supabaseClient
      .from("kaguya_dmca")
      .select("id")
      .eq("mediaId", params[0])
      .eq("mediaType", MediaType.Manga)
      .single();

    if (isDMCA) {
      return {
        props: null,
        redirect: {
          destination: "/got-dmca",
        },
      };
    }

    const media = await getMediaDetails({
      type: MediaType.Manga,
      id: Number(params[0]),
    });

    return {
      props: {
        manga: media as Media,
      },
      revalidate: REVALIDATE_TIME,
    };
  } catch (err) {
    return { notFound: true, revalidate: REVALIDATE_TIME };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
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

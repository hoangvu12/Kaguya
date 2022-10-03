import LocaleEpisodeSelector from "@/components/features/anime/Player/LocaleEpisodeSelector";
import Comments from "@/components/features/comment/Comments";
import AddTranslationModal from "@/components/shared/AddTranslationModal";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import CharacterConnectionCard from "@/components/shared/CharacterConnectionCard";
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
import useEpisodes from "@/hooks/useEpisodes";
import dayjs from "@/lib/dayjs";
import { getMediaDetails } from "@/services/anilist";
import { Media, MediaType } from "@/types/anilist";
import {
  createStudioDetailsUrl,
  numberWithCommas,
  vietnameseSlug,
} from "@/utils";
import { convert, getDescription, getTitle } from "@/utils/data";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsFillPlayFill } from "react-icons/bs";

interface DetailsPageProps {
  anime: Media;
}

const DetailsPage: NextPage<DetailsPageProps> = ({ anime }) => {
  const { user } = useUser();
  const { locale } = useRouter();
  const { t } = useTranslation("anime_details");

  const { data: episodes, isLoading } = useEpisodes(anime.id);

  const nextAiringSchedule = useMemo(
    () =>
      anime?.airingSchedule?.nodes
        ?.sort((a, b) => a.episode - b.episode)
        .find((schedule) => dayjs.unix(schedule.airingAt).isAfter(dayjs())),
    [anime?.airingSchedule]
  );

  const nextAiringScheduleTime = useMemo(() => {
    if (!nextAiringSchedule?.airingAt) return null;

    return dayjs.unix(nextAiringSchedule.airingAt).locale(locale).fromNow();
  }, [nextAiringSchedule?.airingAt, locale]);

  const title = useMemo(() => getTitle(anime, locale), [anime, locale]);
  const description = useMemo(
    () => getDescription(anime, locale),
    [anime, locale]
  );

  useEffect(() => {
    if (!anime) return;

    const syncDataScript = document.querySelector("#syncData");

    syncDataScript.textContent = JSON.stringify({
      title: anime.title.userPreferred,
      aniId: Number(anime.id),
      episode: null,
      id: anime.id,
      nextEpUrl: null,
    });
  }, [anime]);

  return (
    <>
      <Head
        title={`${title} - Kaguya`}
        description={description}
        image={anime.bannerImage}
      />

      <div className="pb-8">
        <DetailsBanner image={anime.bannerImage} />

        <Section className="relative pb-4 bg-background-900">
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="shrink-0 relative left-1/2 -translate-x-1/2 md:static md:left-0 md:-translate-x-0 w-[186px] -mt-20 space-y-6">
              <PlainCard src={anime.coverImage.extraLarge} alt={title} />

              {user && (
                <div className="flex items-center space-x-1">
                  <SourceStatus type="anime" source={anime} />
                  <NotificationButton type="anime" source={anime} />
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-between py-4 mt-4 text-center md:text-left md:items-start md:-mt-16 space-y-4">
              <div className="flex flex-col md:items-start items-center space-y-4 md:no-scrollbar">
                <div className="flex items-center flex-wrap gap-2 mb-4">
                  <Link href={`/anime/watch/${anime.id}`}>
                    <a>
                      <Button primary LeftIcon={BsFillPlayFill}>
                        <p>{t("common:watch_now")}</p>
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
                    <Link href={`/wwf/create/${anime.id}`}>
                      <a>
                        <Button
                          secondary
                          className="w-full"
                          LeftIcon={BsFillPlayFill}
                        >
                          <p>{t("watch_with_friends")}</p>
                        </Button>
                      </a>
                    </Link>

                    <AddTranslationModal
                      mediaId={anime.id}
                      mediaType={MediaType.Anime}
                      defaultDescription={description}
                      defaultTitle={title}
                    />

                    <Link href={`/upload/anime/${anime.id}`}>
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

                <p className="mb-2 text-3xl font-semibold">{title}</p>

                <DotList>
                  {anime.genres.map((genre) => (
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

                {/* MAL-Sync UI */}
                <div id="mal-sync"></div>
              </div>

              <div className="flex gap-x-8 overflow-x-auto md:gap-x-16 [&>*]:shrink-0">
                <InfoItem
                  title={t("common:country")}
                  value={convert(anime.countryOfOrigin, "country", { locale })}
                />
                <InfoItem
                  title={t("common:total_episodes")}
                  value={anime.episodes}
                />

                {anime.duration && (
                  <InfoItem
                    title={t("common:duration")}
                    value={`${anime.duration} ${t("common:minutes")}`}
                  />
                )}

                <InfoItem
                  title={t("common:status")}
                  value={convert(anime.status, "status", { locale })}
                />
                <InfoItem
                  title={t("common:age_rated")}
                  value={anime.isAdult ? "18+" : ""}
                />

                {nextAiringSchedule && (
                  <InfoItem
                    className="!text-primary-300"
                    title={t("next_airing_schedule")}
                    value={`${t("common:episode")} ${
                      nextAiringSchedule.episode
                    }: ${nextAiringScheduleTime}`}
                  />
                )}
              </div>
            </div>
          </div>
        </Section>

        <Section className="w-full min-h-screen gap-8 mt-8 space-y-8 md:space-y-0 md:grid md:grid-cols-10 sm:px-12">
          <div className="md:col-span-2 xl:h-[max-content] space-y-4">
            <div className="flex flex-row md:flex-col overflow-x-auto bg-background-900 rounded-md p-4 gap-4 [&>*]:shrink-0 md:no-scrollbar">
              <InfoItem
                title={t("common:format")}
                value={convert(anime.format, "format", { locale })}
              />
              <InfoItem title="English" value={anime.title.english} />
              <InfoItem title="Native" value={anime.title.native} />
              <InfoItem title="Romanji" value={anime.title.romaji} />
              <InfoItem
                title={t("common:popular")}
                value={numberWithCommas(anime.popularity)}
              />
              <InfoItem
                title={t("common:favourite")}
                value={numberWithCommas(anime.favourites)}
              />
              <InfoItem
                title={t("common:trending")}
                value={numberWithCommas(anime.trending)}
              />

              <InfoItem
                title="Studio"
                value={anime.studios.nodes.map((studio) => (
                  <p key={studio.id}>
                    <Link href={createStudioDetailsUrl(studio)}>
                      <a className="hover:text-primary-300 transition duration-300">
                        {studio.name}
                      </a>
                    </Link>
                  </p>
                ))}
              />

              <InfoItem
                title={t("common:season")}
                value={`${convert(anime.season, "season", { locale })} ${
                  anime.seasonYear
                }`}
              />
              <InfoItem
                title={t("common:synonyms")}
                value={anime.synonyms.map((synomym) => (
                  <p key={synomym}>{synomym}</p>
                ))}
              />
            </div>

            <div className="space-y-2 text-gray-400">
              <h1 className="font-semibold">Tags</h1>

              <ul className="overflow-x-auto flex flex-row md:flex-col gap-2 [&>*]:shrink-0 md:no-scrollbar">
                {anime.tags.map((tag) => (
                  <Link
                    href={{
                      pathname: "/browse",
                      query: { type: "anime", tags: tag.name },
                    }}
                    key={tag.id}
                  >
                    <a className="md:block">
                      <li className="p-2 rounded-md bg-background-900 hover:text-primary-300 transition duration-300">
                        {tag.name}
                      </li>
                    </a>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-12 md:col-span-8">
            <DetailsSection
              title={t("episodes_section")}
              className="overflow-hidden"
            >
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <LocaleEpisodeSelector mediaId={anime.id} episodes={episodes} />
              )}
            </DetailsSection>

            {!!anime?.characters?.edges?.length && (
              <DetailsSection
                title={t("characters_section")}
                className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
              >
                {anime.characters.edges.map((characterEdge, index) => (
                  <CharacterConnectionCard
                    characterEdge={characterEdge}
                    key={index}
                  />
                ))}
              </DetailsSection>
            )}

            {!!anime?.relations?.nodes?.length && (
              <DetailsSection title={t("relations_section")}>
                <List data={anime.relations.nodes}>
                  {(node) => <Card data={node} />}
                </List>
              </DetailsSection>
            )}

            {!!anime?.recommendations?.nodes?.length && (
              <DetailsSection title={t("recommendations_section")}>
                <List
                  data={anime.recommendations.nodes.map(
                    (node) => node.mediaRecommendation
                  )}
                >
                  {(node) => <Card data={node} />}
                </List>
              </DetailsSection>
            )}

            <DetailsSection title={t("comments_section")}>
              <Comments topic={`anime-${anime.id}`} />
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
      .eq("mediaType", MediaType.Anime)
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
      type: MediaType.Anime,
      id: Number(params[0]),
    });

    return {
      props: {
        anime: media as Media,
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
  const title = getTitle(props.anime, router.locale);

  if (slug) return null;

  return {
    url: `/anime/details/${id}/${vietnameseSlug(title)}`,
    options: {
      shallow: true,
    },
  };
});

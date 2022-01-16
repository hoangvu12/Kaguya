import List from "@/components/shared/List";
import Button from "@/components/shared/Button";
import DotList from "@/components/shared/DotList";
import Head from "@/components/shared/Head";
import PlainCard from "@/components/shared/PlainCard";
import { REVALIDATE_TIME } from "@/constants";
import dayjs from "@/lib/dayjs";
import supabase from "@/lib/supabase";
import { Anime, Comment } from "@/types";
import { numberWithCommas, parseNumbersFromString } from "@/utils";
import { convert, getTitle } from "@/utils/data";

import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { BsFillPlayFill } from "react-icons/bs";
import EpisodesSelector from "@/components/features/anime/EpisodesSelector";
import InfoItem from "@/components/shared/InfoItem";
import CommentsSection from "@/components/features/comment/CommentsSection";
import CharacterCard from "@/components/shared/CharacterCard";
import DetailsBanner from "@/components/shared/DetailsBanner";
import DetailsSection from "@/components/shared/DetailsSection";

interface DetailsPageProps {
  anime: Anime;
}

const DetailsPage: NextPage<DetailsPageProps> = ({ anime }) => {
  const router = useRouter();

  const sortedEpisodes = useMemo(
    () =>
      anime.episodes
        .sort((a, b) => {
          const aNumber = parseNumbersFromString(a.name, 9999)?.[0];
          const bNumber = parseNumbersFromString(b.name, 9999)?.[0];

          return aNumber - bNumber;
        })
        .map((episode, index) => ({
          ...episode,
          episodeIndex: index,
          thumbnail_image:
            episode.thumbnail_image ||
            anime.banner_image ||
            anime.cover_image.extra_large,
        })),
    [anime]
  );

  const nextAiringSchedule = anime.airing_schedule.length
    ? anime.airing_schedule.find((schedule) =>
        dayjs.unix(schedule.airing_at).isAfter(dayjs())
      )
    : null;

  const handleNavigateEpisode = (index) => {
    router.push(`/anime/watch/${anime.ani_id}?index=${index}`);
  };

  const title = useMemo(() => getTitle(anime), [anime]);

  return (
    <>
      <Head
        title={`${title} - Kaguya`}
        description={anime.description}
        image={anime.banner_image}
      />

      <div className="pb-8">
        <DetailsBanner image={anime.banner_image} />

        <div className="relative z-10 px-4 pb-4 sm:px-12 bg-background-900">
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="shrink-0 relative left-1/2 -translate-x-1/2 md:static md:left-0 md:-translate-x-0 w-[186px] -mt-20">
              <PlainCard data={anime} />
            </div>

            <div className="flex flex-col items-center justify-between py-4 mt-4 text-center md:text-left md:items-start md:-mt-16">
              <Button
                primary
                LeftIcon={BsFillPlayFill}
                className="mb-8"
                onClick={() => handleNavigateEpisode(0)}
              >
                <p>Xem ngay</p>
              </Button>

              <p className="mb-2 text-3xl font-semibold">{title}</p>

              <DotList>
                {anime.genres.map((genre) => (
                  <p key={genre}>{convert(genre, "genre")}</p>
                ))}
              </DotList>

              <p className="mt-4 mb-8 text-gray-300">{anime.description}</p>

              <div className="flex space-x-8 overflow-x-auto md:scroll-bar snap-x md:space-x-16">
                <InfoItem title="Quốc gia" value={anime.country_of_origin} />
                <InfoItem title="Số tập" value={anime.total_episodes} />

                {anime.duration && (
                  <InfoItem
                    title="Thời lượng"
                    value={`${anime.duration} phút`}
                  />
                )}

                <InfoItem
                  title="Tình trạng"
                  value={convert(anime.status, "status")}
                />
                <InfoItem
                  title="Giới hạn tuổi"
                  value={anime.is_adult ? "18+" : ""}
                />

                {nextAiringSchedule && (
                  <InfoItem
                    className="!text-primary-300"
                    title="Tập tiếp theo"
                    value={`Tập ${nextAiringSchedule.episode}: ${dayjs
                      .unix(nextAiringSchedule.airing_at)
                      .fromNow()}`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full min-h-screen gap-8 px-4 mt-8 space-y-8 md:space-y-0 md:grid md:grid-cols-10 sm:px-12">
          <div className="md:col-span-2 bg-background-900 rounded-md p-4 space-y-4 h-[max-content]">
            <InfoItem
              title="Định dạng"
              value={convert(anime.format, "format")}
            />
            <InfoItem title="English" value={anime.title.english} />
            <InfoItem title="Native" value={anime.title.native} />
            <InfoItem title="Romanji" value={anime.title.romaji} />
            <InfoItem
              title="Nổi bật"
              value={numberWithCommas(anime.popularity)}
            />
            <InfoItem
              title="Yêu thích"
              value={numberWithCommas(anime.favourites)}
            />
            <InfoItem
              title="Xu hướng"
              value={numberWithCommas(anime.trending)}
            />
            <InfoItem
              title="Studio"
              value={anime.studios.slice(0, 3).join(", ")}
            />
            <InfoItem
              title="Mùa"
              value={`${convert(anime.season, "season")} ${anime.season_year}`}
            />
          </div>
          <div className="space-y-12 md:col-span-8">
            <DetailsSection title="Tập phim" className="overflow-hidden">
              <EpisodesSelector
                episodes={sortedEpisodes}
                onClick={handleNavigateEpisode}
                swiperProps={{
                  breakpoints: {
                    1024: {
                      slidesPerView: 3,
                      slidesPerGroup: 3,
                    },
                    768: {
                      slidesPerView: 2,
                      slidesPerGroup: 2,
                    },
                    0: {
                      slidesPerView: 1,
                      slidesPerGroup: 1,
                    },
                  },
                }}
              />
            </DetailsSection>

            {!!anime?.characters?.length && (
              <DetailsSection
                title="Nhân vật"
                className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
              >
                {anime.characters.map((character, index) => (
                  <CharacterCard character={character} key={index} />
                ))}
              </DetailsSection>
            )}

            {!!anime?.relations?.length && (
              <DetailsSection title="Anime liên quan">
                <List
                  type="anime"
                  data={anime.relations.map((relation) => relation.anime)}
                />
              </DetailsSection>
            )}

            {!!anime?.recommendations?.length && (
              <DetailsSection title="Anime hay khác">
                <List
                  type="anime"
                  data={anime.recommendations.map(
                    (recommendation) => recommendation.anime
                  )}
                />
              </DetailsSection>
            )}

            <DetailsSection title="Bình luận">
              <CommentsSection
                query={{
                  queryFn: (from, to) =>
                    supabase
                      .from<Comment>("comments")
                      .select(
                        `
                        *,
                        user:user_id(*),
                        reply_comments!original_id(
                          comment:reply_id(
                            *,
                            user:user_id(*),
                            reactions:comment_reactions(*)
                          )
                        ),
                        reactions:comment_reactions(*)
                        `
                      )
                      .eq("anime_id", anime.ani_id)
                      .is("is_reply", false)
                      .order("created_at", { ascending: true })
                      .range(from, to),
                  queryKey: ["comments", anime.ani_id],
                }}
                anime_id={anime.ani_id}
              />
            </DetailsSection>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data, error } = await supabase
    .from("anime")
    .select(
      `
        *,
        airing_schedule(*),
        characters(*),
        recommendations!original_id(anime:recommend_id(*)),
        relations!original_id(anime:relation_id(*)),
        episodes!episodes_anime_id_fkey(*)
      `
    )
    .eq("ani_id", Number(params.id))
    .single();

  if (error) {
    console.log(error);

    return { notFound: true };
  }

  return {
    props: {
      anime: data as Anime,
    },
    revalidate: REVALIDATE_TIME,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await supabase
    .from<Anime>("anime")
    .select("ani_id")
    .order("updated_at", { ascending: false })
    .limit(20);

  const paths = data.map((anime: Anime) => ({
    params: { id: anime.ani_id.toString() },
  }));

  return { paths, fallback: "blocking" };
};

export default DetailsPage;

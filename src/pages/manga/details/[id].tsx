import CharacterCard from "@/components/shared/CharacterCard";
import DetailsBanner from "@/components/shared/DetailsBanner";
import DetailsSection from "@/components/shared/DetailsSection";
import InfoItem from "@/components/shared/InfoItem";
import List from "@/components/shared/List";
import Button from "@/components/shared/Button";
import DotList from "@/components/shared/DotList";
import Head from "@/components/shared/Head";
import CircleButton from "@/components/shared/CircleButton";
import PlainCard from "@/components/shared/PlainCard";
import CommentsSection from "@/components/features/comment/CommentsSection";
import Link from "next/link";
import { REVALIDATE_TIME } from "@/constants";
import supabase from "@/lib/supabase";
import { Comment, Manga } from "@/types";
import { numberWithCommas, parseNumbersFromString } from "@/utils";
import { convert, getTitle } from "@/utils/data";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { BsChevronDown, BsChevronUp, BsFillPlayFill } from "react-icons/bs";
import { motion } from "framer-motion";

interface DetailsPageProps {
  manga: Manga;
}

const DetailsPage: NextPage<DetailsPageProps> = ({ manga }) => {
  const router = useRouter();
  const [isChapterExpanded, setIsChapterExpanded] = useState(false);

  const handleReadClick = () => {
    router.push(`/manga/read/${manga.ani_id}`);
  };

  const chapters = useMemo(
    () =>
      manga.chapters
        .sort(
          (a, b) =>
            parseNumbersFromString(a.name)[0] -
            parseNumbersFromString(b.name)[0]
        )
        .map((chapter, index) => ({ ...chapter, chapterIndex: index }))
        .reverse(),
    [manga]
  );

  const title = useMemo(() => getTitle(manga), [manga]);

  return (
    <>
      <Head
        title={`${title} - Kaguya`}
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

            <div className="justify-between text-center md:text-left flex flex-col items-center md:items-start py-4 mt-4 md:-mt-16">
              <Button
                primary
                LeftIcon={BsFillPlayFill}
                className="mb-8"
                onClick={handleReadClick}
              >
                <p>Đọc ngay</p>
              </Button>

              <p className="text-3xl font-semibold mb-2">{title}</p>

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
            <DetailsSection title="Chapter" className="relative">
              <motion.div
                className="space-y-2 overflow-hidden"
                variants={{
                  animate: {
                    height: "100%",
                  },

                  initial: {
                    height: chapters.length <= 7 ? "100%" : 300,
                  },
                }}
                transition={{ ease: "linear" }}
                animate={isChapterExpanded ? "animate" : "initial"}
              >
                {chapters.map((chapter) => (
                  <Link
                    href={`/manga/read/${manga.ani_id}?index=${chapter.chapterIndex}`}
                    key={chapter.chapter_id}
                  >
                    <a className="block">
                      <p className="line-clamp-1 bg-background-900 p-2 text-sm font-semibold hover:bg-white/20 duration-300 transition">
                        {chapter.name}
                      </p>
                    </a>
                  </Link>
                ))}
              </motion.div>

              {chapters.length > 7 && (
                <CircleButton
                  onClick={() => setIsChapterExpanded(!isChapterExpanded)}
                  outline
                  className="absolute top-full mt-4 left-1/2 -translate-x-1/2"
                  LeftIcon={isChapterExpanded ? BsChevronUp : BsChevronDown}
                />
              )}
            </DetailsSection>

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
                      .eq("manga_id", manga.ani_id)
                      .is("is_reply", false)
                      .order("created_at", { ascending: true })
                      .range(from, to),
                  queryKey: ["comments", manga.ani_id],
                }}
                manga_id={manga.ani_id}
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
    .from("manga")
    .select(
      `
        *,
        characters:manga_characters(*),
        recommendations:manga_recommendations!original_id(manga:recommend_id(*)),
        relations:manga_relations!original_id(manga:relation_id(*)),
        chapters!chapters_manga_id_fkey(*)
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
    .limit(20);

  const paths = data.map((manga) => ({
    params: { id: manga.ani_id.toString() },
  }));

  return { paths, fallback: "blocking" };
};

export default DetailsPage;

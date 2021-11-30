import NextIcon from "@/components/icons/NextIcon";
import ChapterSelector from "@/components/seldom/ChapterSelector";
import ReadImages from "@/components/seldom/ReadImages";
import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import InView from "@/components/shared/InView";
import { REVALIDATE_TIME } from "@/constants";
import useFetchImages from "@/hooks/useFetchImages";
import useSaveRead from "@/hooks/useSaveRead";
import supabase from "@/lib/supabase";
import { Manga } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlineInfoCircle, AiOutlineLoading3Quarters } from "react-icons/ai";

interface ReadPageProps {
  manga: Manga;
}

const ReadPage: NextPage<ReadPageProps> = ({ manga }) => {
  const router = useRouter();
  const [showControls, setShowControls] = useState(false);
  const [showNextEpisodeBox, setShowNextEpisodeBox] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { index: chapterIndex = 0, id } = router.query;
  const saveReadMutation = useSaveRead();

  const title =
    typeof manga.title === "string" ? manga.title : manga.title.user_preferred;

  const chapters = useMemo(
    () => manga.chapters.sort((a, b) => a.chapter_id - b.chapter_id),
    [manga]
  );

  const currentChapter = useMemo(
    () => chapters[Number(chapterIndex)],
    [chapters, chapterIndex]
  );

  const nextChapter = useMemo(
    () => chapters[Number(chapterIndex) + 1],
    [chapters, chapterIndex]
  );

  const { data } = useFetchImages(manga.slug, currentChapter.chapter_id);

  const handleChapterNavigate = useCallback(
    (chapterIndex: number) => {
      router.push(`/manga/read/${id}?index=${chapterIndex}`, null, {
        shallow: true,
      });
    },
    [id, router]
  );

  const handleOverlayClick = useCallback(() => {
    if (showNextEpisodeBox) {
      setShowNextEpisodeBox(false);

      return;
    }

    setShowControls(!showControls);
  }, [showControls, showNextEpisodeBox]);

  const handleBottomScroll = useCallback(() => {
    setShowNextEpisodeBox(true);
    setShowControls(false);
  }, []);

  useEffect(() => {
    saveReadMutation.mutate({
      manga_id: Number(id),
      chapter_id: currentChapter.chapter_id,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapter.chapter_id]);

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <Head
        title={`${title} - Kaguya`}
        description={`Đọc truyện ${title} tại Kaguya. Hoàn toàn miễn phí, không quảng cáo`}
        image={manga.banner_image || manga.cover_image.large}
      />

      <div className="w-full md:w-[800px]">
        {data?.images.length ? (
          <React.Fragment>
            <ReadImages
              images={data.images}
              onImagesLoaded={() => {
                setImagesLoaded(true);
              }}
            />

            {imagesLoaded && <InView onInView={handleBottomScroll} />}
          </React.Fragment>
        ) : (
          <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <AiOutlineLoading3Quarters className="w-16 h-16 animate-spin text-primary-500" />
          </div>
        )}
      </div>

      {/* Controls */}
      <motion.div
        className="fixed inset-0 w-full"
        animate={showControls ? "animate" : "exit"}
      >
        <motion.div
          variants={{ animate: { y: 0 }, exit: { y: "-100%" } }}
          transition={{ ease: "linear", duration: 0.2 }}
          className="z-[1] fixed top-0 flex items-center justify-center w-full h-24 bg-background-900"
        >
          <div>
            <p className="text-2xl font-semibold">{title}</p>

            <p className="text-lg text-gray-300">{currentChapter.name}</p>
          </div>
        </motion.div>

        <motion.div
          variants={{ animate: { y: 0 }, exit: { y: "100%" } }}
          transition={{ ease: "linear", duration: 0.2 }}
          className="flex px-4 items-center justify-evenly md:justify-center md:space-x-8 z-[1] absolute bottom-0 w-full h-24 bg-background-900"
        >
          <Button
            className="!bg-transparent hover:bg-white/20"
            LeftIcon={AiOutlineInfoCircle}
            onClick={() => {
              router.push(`/manga/details/${id}`);
            }}
            iconClassName="w-10 h-10 lg:w-8 lg:h-8"
          >
            <p className="hidden md:inline">Thông tin truyện</p>
          </Button>

          {chapterIndex < chapters.length - 1 && (
            <Button
              className="!bg-transparent hover:bg-white/20"
              LeftIcon={NextIcon}
              onClick={() => handleChapterNavigate(Number(chapterIndex) + 1)}
              iconClassName="w-10 h-10 lg:w-8 lg:h-8"
            >
              <p className="hidden md:inline">Chapter tiếp theo</p>
            </Button>
          )}

          <ChapterSelector
            chapters={chapters}
            onChapterChange={handleChapterNavigate}
            currentChapter={currentChapter}
          />
        </motion.div>

        <motion.div
          onClick={handleOverlayClick}
          className="absolute inset-0 z-0 bg-black/60"
          variants={{
            animate: {
              opacity: 1,
            },
            exit: { opacity: 0 },
          }}
          transition={{ ease: "linear", duration: 0.2 }}
        />
      </motion.div>

      {/* Next episode box */}
      <AnimatePresence>
        {showNextEpisodeBox && (
          <motion.div
            className="fixed bottom-0 flex flex-col justify-between w-full h-40 p-4 bg-background-900"
            variants={{
              animate: {
                y: 0,
              },
              exit: {
                y: "100%",
              },
            }}
            animate="animate"
            initial="exit"
            exit="exit"
            transition={{ ease: "linear", duration: 0.2 }}
          >
            <div>
              <p className="text-base text-gray-300">Chapter tiếp theo:</p>
              <p className="text-3xl">{nextChapter.name}</p>
            </div>

            <div className="flex items-center space-x-4">
              <ChapterSelector
                chapters={chapters}
                onChapterChange={handleChapterNavigate}
                currentChapter={currentChapter}
              />

              <Button
                primary
                onClick={() => handleChapterNavigate(Number(chapterIndex) + 1)}
                LeftIcon={NextIcon}
              >
                <p>Đọc tiếp</p>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data, error } = await supabase
    .from<Manga>("manga")
    .select(
      `
        title,
        slug,
        chapters!manga_id(*),
        banner_image,
        cover_image
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
      manga: { ...data, chapters: data.chapters.reverse() },
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

// @ts-ignore
ReadPage.getLayout = (page) => page;

export default ReadPage;
function useMangaImages(): {} {
  throw new Error("Function not implemented.");
}

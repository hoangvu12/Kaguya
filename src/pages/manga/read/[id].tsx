import ReadImages from "@/components/seldom/ReadImages";
import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Loading from "@/components/shared/Loading";
import Portal from "@/components/shared/Portal";
import { REVALIDATE_TIME } from "@/constants";
import { ReadContextProvider } from "@/contexts/ReadContext";
import { ReadSettingsContextProvider } from "@/contexts/ReadSettingsContext";
import useFetchImages from "@/hooks/useFetchImages";
import useSavedRead from "@/hooks/useSavedRead";
import useSaveRead from "@/hooks/useSaveRead";
import supabase from "@/lib/supabase";
import { Manga } from "@/types";
import { parseNumbersFromString } from "@/utils";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const ReadPanel = dynamic(() => import("@/components/seldom/ReadPanel"), {
  ssr: false,
});

interface ReadPageProps {
  manga: Manga;
}

const ReadPage: NextPage<ReadPageProps> = ({ manga }) => {
  const router = useRouter();
  const [showReadOverlay, setShowReadOverlay] = useState(false);
  const [declinedReread, setDeclinedReread] = useState(false);
  const saveReadTimeout = useRef<NodeJS.Timeout>();

  const { index: chapterIndex = 0, id } = router.query;

  const {
    data: savedReadData,
    isLoading: isSavedDataLoading,
    isError: isSavedDataError,
  } = useSavedRead(Number(id));

  const saveReadMutation = useSaveRead();

  const title =
    typeof manga.title === "string" ? manga.title : manga.title.user_preferred;

  const chapters = useMemo(
    () =>
      manga.chapters.sort(
        (a, b) =>
          parseNumbersFromString(a.name)[0] - parseNumbersFromString(b.name)[0]
      ),
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

  const readChapter = useMemo(
    () =>
      isSavedDataError
        ? null
        : chapters.find(
            (chapter) => chapter.chapter_id === savedReadData?.chapter_id
          ),
    [chapters, savedReadData, isSavedDataError]
  );

  const { data } = useFetchImages(
    manga.slug,
    currentChapter.chapter_id,
    nextChapter?.chapter_id
  );

  const handleChapterNavigate = useCallback(
    (chapterIndex: number) => {
      router.replace(`/manga/read/${id}?index=${chapterIndex}`, null, {
        shallow: true,
      });
    },
    [id, router]
  );

  useEffect(() => {
    if (
      !readChapter ||
      isSavedDataLoading ||
      isSavedDataError ||
      declinedReread
    )
      return;

    if (currentChapter.chapter_id === readChapter?.chapter_id) {
      setDeclinedReread(true);

      return;
    }

    setShowReadOverlay(true);
  }, [
    currentChapter.chapter_id,
    declinedReread,
    isSavedDataError,
    isSavedDataLoading,
    readChapter,
  ]);

  useEffect(() => {
    if (saveReadTimeout.current) {
      clearTimeout(saveReadTimeout.current);
    }

    saveReadTimeout.current = setTimeout(
      () =>
        saveReadMutation.mutate({
          manga_id: Number(id),
          chapter_id: currentChapter.chapter_id,
        }),
      10000
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapter.chapter_id]);

  return (
    <ReadContextProvider
      value={{
        manga,
        currentChapter,
        chapters,
        chapterIndex: Number(chapterIndex),
        setChapterIndex: handleChapterNavigate,
      }}
    >
      <ReadSettingsContextProvider>
        <div className="flex items-center justify-center w-full min-h-screen">
          <Head
            title={`${title} - Kaguya`}
            description={`Đọc truyện ${title} tại Kaguya. Hoàn toàn miễn phí, không quảng cáo`}
            image={manga.banner_image || manga.cover_image.large}
          />

          <ReadPanel>
            {({ isSidebarOpen }) =>
              data?.images.length ? (
                <ReadImages
                  isSidebarOpen={isSidebarOpen}
                  images={data.images}
                />
              ) : (
                <Loading />
              )
            }
          </ReadPanel>

          {showReadOverlay && !declinedReread && (
            <Portal>
              <div
                className="fixed inset-0 z-40 bg-black/70"
                onClick={() => {
                  setShowReadOverlay(false);
                  setDeclinedReread(true);
                }}
              />

              <div className="fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-50 w-11/12 lg:w-2/3 p-8 rounded-md bg-background-900">
                <h1 className="text-4xl font-bold mb-4">
                  Đọc {readChapter.name}
                </h1>
                <p className="">
                  Hệ thống ghi nhận bạn đã đọc {readChapter.name}.
                </p>
                <p className="mb-4">
                  Bạn có muốn đọc {readChapter.name} không?
                </p>
                <div className="flex items-center justify-end space-x-4">
                  <Button
                    onClick={() => {
                      setShowReadOverlay(false), setDeclinedReread(true);
                    }}
                    className="!bg-transparent hover:!bg-white/20 transition duration-300"
                  >
                    <p>Không</p>
                  </Button>
                  <Button
                    onClick={() => {
                      if (!readChapter || isSavedDataLoading) return;

                      const chapterIndex = chapters.findIndex(
                        (chapter) =>
                          chapter.chapter_id === readChapter.chapter_id
                      );

                      handleChapterNavigate(chapterIndex);
                    }}
                    primary
                  >
                    <p>Đọc</p>
                  </Button>
                </div>
              </div>
            </Portal>
          )}
        </div>
      </ReadSettingsContextProvider>
    </ReadContextProvider>
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
    .limit(20);

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

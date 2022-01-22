import EpisodeSelector from "@/components/features/anime/EpisodeSelector";
import Button from "@/components/shared/Button";
import ClientOnly from "@/components/shared/ClientOnly";
import EpisodeCard from "@/components/features/anime/EpisodeCard";
import Head from "@/components/shared/Head";
import Loading from "@/components/shared/Loading";
import MobileNextEpisode from "@/components/features/anime/Player/MobileNextEpisode";
import Portal from "@/components/shared/Portal";
import Video from "@/components/features/anime/Player";
import EpisodesButton from "@/components/features/anime/Player/EpisodesButton";
import MobileEpisodesButton from "@/components/features/anime/Player/MobileEpisodesButton";
import NextEpisodeButton from "@/components/features/anime/Player/NextEpisodeButton";
import { REVALIDATE_TIME } from "@/constants";
import useDevice from "@/hooks/useDevice";
import useEventListener from "@/hooks/useEventListener";
import { useFetchSource } from "@/hooks/useFetchSource";
import useSavedWatched from "@/hooks/useSavedWatched";
import useSaveWatched from "@/hooks/useSaveWatched";
import supabase from "@/lib/supabase";
import { Anime } from "@/types";
import { parseNumbersFromString } from "@/utils";
import { getTitle } from "@/utils/data";
import Storage from "@/utils/storage";
import classNames from "classnames";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { BsArrowLeft } from "react-icons/bs";

const noop = () => {};

interface WatchPageProps {
  anime: Anime;
}

const blankVideo = [
  {
    file: "https://cdn.plyr.io/static/blank.mp4",
    label: "720p",
  },
];

const WatchPage: NextPage<WatchPageProps> = ({ anime }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { isMobile } = useDevice();
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);
  const [showWatchedOverlay, setShowWatchedOverlay] = useState(false);
  const [declinedRewatch, setDeclinedRewatch] = useState(false);

  const showInfoTimeout = useRef<NodeJS.Timeout>(null);
  const saveWatchedInterval = useRef<NodeJS.Timer>(null);
  const saveWatchedMutation = useSaveWatched();

  const { index: episodeIndex = 0, id } = router.query;

  const {
    data: watchedEpisodeData,
    isLoading: isSavedDataLoading,
    isError: isSavedDataError,
  } = useSavedWatched(Number(id));

  useEventListener("visibilitychange", () => {
    if (isMobile) return;

    if (showInfoTimeout.current) {
      clearTimeout(showInfoTimeout.current);
    }

    if (!document.hidden) return;

    showInfoTimeout.current = setTimeout(() => {
      setShowInfoOverlay(true);
    }, 5000);
  });

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
    [anime.banner_image, anime.cover_image, anime.episodes]
  );

  const watchedEpisode = useMemo(
    () =>
      isSavedDataError
        ? null
        : sortedEpisodes.find(
            (episode) => episode.episode_id === watchedEpisodeData?.episode_id
          ),
    [isSavedDataError, sortedEpisodes, watchedEpisodeData?.episode_id]
  );

  const currentEpisode = useMemo(
    () => sortedEpisodes[Number(episodeIndex)],
    [sortedEpisodes, episodeIndex]
  );
  const nextEpisode = useMemo(
    () => sortedEpisodes[Number(episodeIndex) + 1],
    [episodeIndex, sortedEpisodes]
  );

  const handleNavigateEpisode = useCallback(
    (index: number) => () => {
      router.replace(`/anime/watch/${id}?index=${index}`, null, {
        shallow: true,
      });
    },
    [id, router]
  );

  const { data, isLoading } = useFetchSource(
    currentEpisode.episode_id,
    nextEpisode?.episode_id
  );

  // Show watched overlay
  useEffect(() => {
    if (
      !watchedEpisode ||
      isSavedDataLoading ||
      isSavedDataError ||
      declinedRewatch
    )
      return;

    if (currentEpisode.episode_id === watchedEpisode?.episode_id) {
      setDeclinedRewatch(true);

      return;
    }

    setShowWatchedOverlay(true);
  }, [
    currentEpisode.episode_id,
    declinedRewatch,
    isSavedDataError,
    isSavedDataLoading,
    watchedEpisode,
  ]);

  useEffect(() => {
    if (saveWatchedInterval.current) {
      clearInterval(saveWatchedInterval.current);
    }

    saveWatchedInterval.current = setInterval(() => {
      saveWatchedMutation.mutate({
        anime_id: Number(id),
        episode_id: currentEpisode.episode_id,
        watched_time: videoRef.current?.currentTime,
      });
    }, 30000);

    return () => {
      clearInterval(saveWatchedInterval.current);
    };
  }, [currentEpisode.episode_id, id, saveWatchedMutation]);

  useEffect(() => {
    if (!navigator?.mediaSession) return;

    const videoEl = videoRef.current;

    if (!videoEl) return;

    const handleNavigator = () => {
      navigator.mediaSession.setActionHandler("previoustrack", function () {
        if (episodeIndex === 0) return;

        handleNavigateEpisode(Number(episodeIndex) - 1)();
      });

      navigator.mediaSession.setActionHandler("nexttrack", function () {
        if (episodeIndex === sortedEpisodes.length - 1) return;

        handleNavigateEpisode(Number(episodeIndex) + 1)();
      });
    };

    videoEl.addEventListener("canplay", handleNavigator, { once: true });

    return () => {
      videoEl.removeEventListener("canplay", handleNavigator);
    };
  }, [episodeIndex, handleNavigateEpisode, sortedEpisodes.length]);

  const title = useMemo(() => getTitle(anime), [anime]);

  useEffect(() => {
    const videoEl = videoRef.current;

    if (!videoEl) return;
    if (isSavedDataLoading) return;
    if (!watchedEpisodeData?.watched_time) return;

    if (watchedEpisode?.episode_id !== currentEpisode?.episode_id) return;

    const handleVideoPlay = () => {
      videoEl.currentTime = watchedEpisodeData.watched_time;
    };

    // Only set the video time if the video is ready
    videoEl.addEventListener("canplay", handleVideoPlay, { once: true });

    return () => {
      videoEl.removeEventListener("canplay", handleVideoPlay);
    };
  }, [
    currentEpisode?.episode_id,
    isSavedDataLoading,
    watchedEpisode?.episode_id,
    watchedEpisodeData,
  ]);

  useEffect(() => {
    const videoEl = videoRef.current;

    if (!videoEl) return;

    const storage = new Storage("watched");

    const handleTimeUpdate = () => {
      storage.update(
        { anime_id: Number(id) },
        {
          anime_id: Number(id),
          anime,
          episode_id: currentEpisode.episode_id,
          episode: currentEpisode,
          watched_time: videoEl.currentTime,
        }
      );
    };

    videoEl.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoEl.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [anime, currentEpisode, id, videoRef]);

  return (
    <div className="relative w-full h-screen">
      <Head
        title={`${title} - Kaguya`}
        description={`Xem phim ${title} tại Kaguya. Hoàn toàn miễn phí, không quảng cáo`}
        image={currentEpisode.thumbnail_image || anime.banner_image}
      />

      <Video
        ref={videoRef}
        src={isLoading ? blankVideo : data.sources}
        className="object-contain w-full h-full"
        autoPlay
        overlaySlot={
          <BsArrowLeft
            className="absolute w-10 h-10 transition duration-300 cursor-pointer top-10 left-10 hover:text-gray-200"
            onClick={router.back}
          />
        }
        onKeyNextEpisode={
          episodeIndex < sortedEpisodes.length - 1
            ? handleNavigateEpisode(Number(episodeIndex) + 1)
            : noop
        }
        onKeyPreviousEpisode={
          episodeIndex > 0
            ? handleNavigateEpisode(Number(episodeIndex) - 1)
            : noop
        }
      />

      {isLoading && (
        <Portal selector=".video-wrapper">
          <Loading />
        </Portal>
      )}

      {/* Because Controls component cause too much rerender (rerender based on video playing) */}
      {/* It makes these two components perform really bad */}
      {/* This bring them to the right position, but not being rerender by the parent */}
      <ClientOnly>
        {/* Browser Only */}
        <BrowserView>
          <Portal selector=".right-controls-slot">
            {episodeIndex < sortedEpisodes.length - 1 && (
              <NextEpisodeButton
                onClick={handleNavigateEpisode(Number(episodeIndex) + 1)}
              >
                <div className="w-96">
                  <p className="mb-4 text-xl">Tập tiếp theo</p>

                  <EpisodeCard episode={nextEpisode} />
                </div>
              </NextEpisodeButton>
            )}

            <EpisodesButton>
              <div className="w-[70vw] overflow-hidden">
                <EpisodeSelector
                  episodes={sortedEpisodes}
                  activeIndex={Number(episodeIndex)}
                  episodeLinkProps={{ shallow: true }}
                />
              </div>
            </EpisodesButton>
          </Portal>
        </BrowserView>

        {/* Mobile Only */}
        <MobileView>
          <Portal selector=".mobile-controls">
            <MobileEpisodesButton>
              {(isOpen, setIsOpen) =>
                isOpen && (
                  <div
                    className={classNames(
                      "w-full px-2 fixed inset-0 z-[9999] flex flex-col justify-center bg-background"
                    )}
                  >
                    <BsArrowLeft
                      className="absolute w-8 h-8 transition duration-300 cursor-pointer left-3 top-3 hover:text-gray-200"
                      onClick={() => setIsOpen(false)}
                    />

                    <div>
                      <EpisodeSelector
                        episodes={sortedEpisodes}
                        activeIndex={Number(episodeIndex)}
                      />
                    </div>
                  </div>
                )
              }
            </MobileEpisodesButton>

            {episodeIndex < sortedEpisodes.length - 1 && (
              <MobileNextEpisode
                onClick={handleNavigateEpisode(Number(episodeIndex) + 1)}
              />
            )}
          </Portal>
        </MobileView>
      </ClientOnly>

      {showInfoOverlay && (
        <Portal>
          <div
            className="fixed inset-0 z-[9999] flex items-center bg-black/70"
            onMouseMove={() => setShowInfoOverlay(false)}
          >
            <div className="w-11/12 px-40">
              <p className="mb-2 text-xl text-gray-200">Bạn đang xem</p>
              <p className="mb-8 text-5xl font-semibold">
                {title} - {currentEpisode.name}
              </p>
              <p className="text-lg text-gray-300">{anime.description}</p>
            </div>
          </div>
        </Portal>
      )}

      {showWatchedOverlay && !declinedRewatch && (
        <Portal selector=".video-wrapper">
          <div
            className="fixed inset-0 z-40 bg-black/70"
            onClick={() => {
              setShowWatchedOverlay(false);
              setDeclinedRewatch(true);
            }}
          />

          <div className="fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-50 w-2/3 p-8 rounded-md bg-background-900">
            <h1 className="text-4xl font-bold mb-4">
              Xem {watchedEpisode.name}
            </h1>
            <p className="">
              Hệ thống ghi nhận bạn đã xem {watchedEpisode.name}.
            </p>
            <p className="mb-4">Bạn có muốn xem {watchedEpisode.name} không?</p>
            <div className="flex items-center justify-end space-x-4">
              <Button
                onClick={() => {
                  setShowWatchedOverlay(false), setDeclinedRewatch(true);
                }}
                className="!bg-transparent hover:!bg-white/20 transition duration-300"
              >
                <p>Không</p>
              </Button>
              <Button
                onClick={() => {
                  if (!watchedEpisode || isSavedDataLoading) return;

                  const episodeIndex = sortedEpisodes.findIndex(
                    (episode) =>
                      episode.episode_id === watchedEpisodeData.episode_id
                  );

                  handleNavigateEpisode(episodeIndex)();
                }}
                primary
              >
                <p>Xem</p>
              </Button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data, error } = await supabase
    .from("anime")
    .select(
      `
        title,
        vietnamese_title,
        description,
        banner_image,
        cover_image,
        episodes!anime_id(*)
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

// @ts-ignore
WatchPage.getLayout = (page) => page;

export default WatchPage;

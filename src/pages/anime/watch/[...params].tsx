import EpisodesButton from "@/components/features/anime/Player/EpisodesButton";
import MobileEpisodesButton from "@/components/features/anime/Player/MobileEpisodesButton";
import MobileNextEpisode from "@/components/features/anime/Player/MobileNextEpisode";
import NextEpisodeButton from "@/components/features/anime/Player/NextEpisodeButton";
import SourceEpisodeSelector from "@/components/features/anime/SourceEpisodeSelector";
import Button from "@/components/shared/Button";
import ClientOnly from "@/components/shared/ClientOnly";
import Head from "@/components/shared/Head";
import Loading from "@/components/shared/Loading";
import Portal from "@/components/shared/Portal";
import config from "@/config";
import { REVALIDATE_TIME } from "@/constants";
import useDevice from "@/hooks/useDevice";
import useEventListener from "@/hooks/useEventListener";
import { useFetchSource } from "@/hooks/useFetchSource";
import useSavedWatched from "@/hooks/useSavedWatched";
import useSaveWatched from "@/hooks/useSaveWatched";
import supabase from "@/lib/supabase";
import { Anime, Episode } from "@/types";
import { getTitle, sortMediaUnit } from "@/utils/data";
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
import Video from "@/components/features/anime/Player";

interface WatchPageProps {
  anime: Anime;
}

const blankVideo = [
  {
    file: "https://cdn.plyr.io/static/blank.mp4",
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

  const { params } = router.query;

  const episodes = useMemo(
    () =>
      anime.sourceConnections.flatMap((connection) =>
        connection.episodes.map((episode) => ({
          ...episode,
          sourceConnection: connection,
        }))
      ),
    [anime.sourceConnections]
  );

  const sortedEpisodes = useMemo(() => sortMediaUnit(episodes), [episodes]);

  const [
    animeId,
    sourceId = sortedEpisodes[0].sourceId,
    episodeId = sortedEpisodes[0].sourceEpisodeId,
  ] = params as string[];

  const {
    data: watchedEpisodeData,
    isLoading: isSavedDataLoading,
    isError: isSavedDataError,
  } = useSavedWatched(Number(animeId));

  const watchedEpisode = useMemo(
    () =>
      isSavedDataError
        ? null
        : sortedEpisodes.find(
            (episode) =>
              episode.sourceEpisodeId ===
              watchedEpisodeData?.episode?.sourceEpisodeId
          ),
    [
      isSavedDataError,
      sortedEpisodes,
      watchedEpisodeData?.episode?.sourceEpisodeId,
    ]
  );

  const sourceEpisodes = useMemo(
    () => episodes.filter((episode) => episode.sourceId === sourceId),
    [episodes, sourceId]
  );

  const currentEpisode = useMemo(
    () =>
      sourceEpisodes.find((episode) => episode.sourceEpisodeId === episodeId),
    [sourceEpisodes, episodeId]
  );

  const currentEpisodeIndex = useMemo(
    () =>
      sourceEpisodes.findIndex(
        (episode) => episode.sourceEpisodeId === episodeId
      ),
    [episodeId, sourceEpisodes]
  );

  const nextEpisode = useMemo(
    () => sourceEpisodes[currentEpisodeIndex + 1],
    [currentEpisodeIndex, sourceEpisodes]
  );

  const handleNavigateEpisode = useCallback(
    (episode: Episode) => () => {
      if (!episode) return;

      router.replace(
        `/anime/watch/${animeId}/${episode.sourceId}/${episode.sourceEpisodeId}`,
        null,
        {
          shallow: true,
        }
      );
    },
    [animeId, router]
  );

  const { data, isLoading, isError, error } = useFetchSource(
    currentEpisode,
    nextEpisode
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

    if (currentEpisode.sourceEpisodeId === watchedEpisode?.sourceEpisodeId) {
      setDeclinedRewatch(true);

      return;
    }

    setShowWatchedOverlay(true);
  }, [
    currentEpisode.sourceEpisodeId,
    declinedRewatch,
    isSavedDataError,
    isSavedDataLoading,
    watchedEpisode,
  ]);

  useEffect(() => {
    const videoEl = videoRef.current;

    if (!videoEl) return;

    const handleSaveTime = () => {
      if (saveWatchedInterval.current) {
        clearInterval(saveWatchedInterval.current);
      }

      saveWatchedInterval.current = setInterval(() => {
        saveWatchedMutation.mutate({
          media_id: Number(animeId),
          episode_id: `${currentEpisode.sourceId}-${currentEpisode.sourceEpisodeId}`,
          watched_time: videoRef.current?.currentTime,
        });
      }, 30000);
    };

    videoEl.addEventListener("canplay", handleSaveTime);

    return () => {
      clearInterval(saveWatchedInterval.current);
      videoEl.removeEventListener("canplay", handleSaveTime);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeId, currentEpisode]);

  useEffect(() => {
    const videoEl = videoRef.current;

    if (!videoEl) return;
    if (isSavedDataLoading) return;
    if (!watchedEpisodeData?.watchedTime) return;

    if (watchedEpisode?.sourceEpisodeId !== currentEpisode?.sourceEpisodeId)
      return;

    const handleVideoPlay = () => {
      videoEl.currentTime = watchedEpisodeData.watchedTime;
    };

    // Only set the video time if the video is ready
    videoEl.addEventListener("canplay", handleVideoPlay, { once: true });

    return () => {
      videoEl.removeEventListener("canplay", handleVideoPlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedEpisode?.sourceEpisodeId]);

  const title = useMemo(() => getTitle(anime), [anime]);

  const overlaySlot = useMemo(
    () => (
      <BsArrowLeft
        className="absolute w-10 h-10 transition duration-300 cursor-pointer top-10 left-10 hover:text-gray-200"
        onClick={router.back}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const proxyBuilder = useCallback(
    (url: string) => {
      if (url.includes(config.proxyServerUrl)) return url;

      const encodedUrl = encodeURIComponent(url);

      const requestUrl = `${config.proxyServerUrl}/?url=${encodedUrl}&source_id=${currentEpisode.sourceId}`;

      return requestUrl;
    },
    [currentEpisode.sourceId]
  );

  return (
    <div className="relative w-full h-screen">
      <Head
        title={`${title} (${currentEpisode.name}) - Kaguya`}
        description={`Xem phim ${title} (${currentEpisode.name}) tại Kaguya. Hoàn toàn miễn phí, không quảng cáo`}
        image={anime.bannerImage}
      />

      {isError ? (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-8">
          <div className="space-y-4 text-center">
            <p className="text-4xl font-semibold">｡゜(｀Д´)゜｡</p>
            <p className="text-xl">
              Đã có lỗi xảy ra ({error?.response?.data?.error})
            </p>
          </div>

          <Button primary onClick={router.back}>
            <p>Trở về trang trước</p>
          </Button>
        </div>
      ) : (
        <Video
          ref={videoRef}
          src={isLoading ? blankVideo : data.sources}
          subtitles={isLoading ? [] : data.subtitles}
          className="object-contain w-full h-full"
          overlaySlot={overlaySlot}
          proxyBuilder={proxyBuilder}
        />
      )}

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
            {currentEpisodeIndex < sourceEpisodes.length - 1 && (
              <NextEpisodeButton onClick={handleNavigateEpisode(nextEpisode)} />
            )}

            <EpisodesButton>
              <div className="w-[70vw] overflow-hidden">
                <SourceEpisodeSelector
                  episodes={sortedEpisodes}
                  activeEpisode={currentEpisode}
                  episodeLinkProps={{ shallow: true, replace: true }}
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
                      <SourceEpisodeSelector
                        episodes={sortedEpisodes}
                        activeEpisode={currentEpisode}
                        episodeLinkProps={{ shallow: true, replace: true }}
                      />
                    </div>
                  </div>
                )
              }
            </MobileEpisodesButton>

            {currentEpisodeIndex < sourceEpisodes.length - 1 && (
              <MobileNextEpisode onClick={handleNavigateEpisode(nextEpisode)} />
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
                onClick={handleNavigateEpisode(watchedEpisodeData?.episode)}
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

export const getStaticProps: GetStaticProps = async ({
  params: { params },
}) => {
  const { data, error } = await supabase
    .from<Anime>("kaguya_anime")
    .select(
      `
        title,
        vietnameseTitle,
        description,
        bannerImage,
        coverImage,
        sourceConnections:kaguya_anime_source!mediaId(*, episodes:kaguya_episodes(*, source:kaguya_sources(id, name)))`
    )
    .eq("id", Number(params[0]))
    .single();

  if (error) {
    console.log(error);

    return { notFound: true };
  }

  return {
    props: {
      anime: data,
    },
    revalidate: REVALIDATE_TIME,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await supabase
    .from<Anime>("kaguya_anime")
    .select("id")
    .order("updated_at", { ascending: false })
    .limit(20);

  const paths = data.map((anime: Anime) => ({
    params: { params: [anime.id.toString()] },
  }));

  return { paths, fallback: "blocking" };
};

// @ts-ignore
WatchPage.getLayout = (page) => page;

export default WatchPage;

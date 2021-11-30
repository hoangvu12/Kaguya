import Accordion from "@/components/shared/Accordion";
import ClientOnly from "@/components/shared/ClientOnly";
import EpisodeCard from "@/components/shared/EpisodeCard";
import Head from "@/components/shared/Head";
import MobileNextEpisode from "@/components/shared/MobileNextEpisode";
import Portal from "@/components/shared/Portal";
import Video from "@/components/shared/Video";
import EpisodesButton from "@/components/shared/Video/EpisodesButton";
import MobileEpisodesButton from "@/components/shared/Video/MobileEpisodesButton";
import NextEpisodeButton from "@/components/shared/Video/NextEpisodeButton";
import { REVALIDATE_TIME } from "@/constants";
import useDevice from "@/hooks/useDevice";
import useEventListener from "@/hooks/useEventListener";
import { useFetchSource } from "@/hooks/useFetchSource";
import useSaveWatched from "@/hooks/useSaveWatched";
import supabase from "@/lib/supabase";
import { Anime } from "@/types";
import { chunk } from "@/utils";
import classNames from "classnames";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";

interface WatchPageProps {
  anime: Anime;
}

const blankVideo = "https://cdn.plyr.io/static/blank.mp4";

const WatchPage: NextPage<WatchPageProps> = ({ anime }) => {
  const router = useRouter();
  const { isMobile } = useDevice();
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);
  const showInfoTimeout = useRef<NodeJS.Timeout>(null);
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

  const sortedEpisodes = useMemo(
    () =>
      anime.episodes
        .sort((a, b) => a.episode_id - b.episode_id)
        .map((episode, index) => ({ ...episode, episodeIndex: index })),
    [anime.episodes]
  );

  const { index: episodeIndex = 0, id } = router.query;

  const episode = useMemo(
    () => sortedEpisodes[Number(episodeIndex)],
    [sortedEpisodes, episodeIndex]
  );
  const nextEpisode = useMemo(
    () => sortedEpisodes[Number(episodeIndex) + 1],
    [episodeIndex, sortedEpisodes]
  );

  const handleNavigateEpisode = (index: number) => () => {
    router.replace(`/anime/watch/${id}?index=${index}`, null, {
      shallow: true,
    });
  };

  const { data, isLoading } = useFetchSource(episode.episode_id);

  useEffect(() => {
    saveWatchedMutation.mutate({
      anime_id: Number(id),
      episode_id: episode.episode_id,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode.episode_id]);

  return (
    <div className="relative w-full h-screen">
      <Head
        title={`${anime.title.user_preferred} - Kaguya`}
        description={`Xem phim ${anime.title.user_preferred} tại Kaguya. Hoàn toàn miễn phí, không quảng cáo`}
        image={episode.thumbnail_image || anime.banner_image}
      />

      {isLoading && (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
          <AiOutlineLoading3Quarters className="w-16 h-16 animate-spin text-primary-500" />
        </div>
      )}

      <Video
        src={isLoading ? blankVideo : data.url}
        className="object-contain w-full h-full"
        autoPlay
        overlaySlot={
          <BsArrowLeft
            className="absolute w-10 h-10 transition duration-300 cursor-pointer top-10 left-10 hover:text-gray-200"
            onClick={router.back}
          />
        }
      />

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
              <div className="w-96 max-h-[40vh] overflow-y-scroll scroll-bar space-y-8">
                {chunk(sortedEpisodes, 12).map((chunk, index) => {
                  const firstEpisode = chunk[0];
                  const lastEpisode = chunk[chunk.length - 1];

                  const title =
                    chunk.length === 1
                      ? `Tập ${firstEpisode.name}`
                      : `Tập ${firstEpisode.name} - Tập ${lastEpisode.name}`;

                  return (
                    <Accordion title={title} key={index} className="space-y-4">
                      {chunk.map((episode) => (
                        <EpisodeCard
                          episode={episode}
                          key={episode.episode_id}
                          onClick={handleNavigateEpisode(episode.episodeIndex)}
                          isActive={
                            episode.episodeIndex === Number(episodeIndex) ||
                            false
                          }
                        />
                      ))}
                    </Accordion>
                  );
                })}
              </div>
            </EpisodesButton>
          </Portal>
        </BrowserView>

        {/* Mobile Only */}
        <MobileView>
          <Portal selector=".mobile-controls">
            <MobileEpisodesButton>
              {(isOpen, setIsOpen) => (
                <div
                  className={classNames(
                    "fixed inset-0 z-[9999] flex items-center bg-background",
                    !isOpen && "hidden"
                  )}
                >
                  <BsArrowLeft
                    className="absolute w-10 h-10 transition duration-300 cursor-pointer left-5 top-5 hover:text-gray-200"
                    onClick={() => setIsOpen(false)}
                  />

                  <div className="flex space-x-8 overflow-x-auto snap-x">
                    {sortedEpisodes.map((episode) => (
                      <div className="w-80" key={episode.episode_id}>
                        <EpisodeCard
                          episode={episode}
                          onClick={handleNavigateEpisode(episode.episodeIndex)}
                          isActive={
                            episode.episodeIndex === Number(episodeIndex) ||
                            false
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <p className="absolute mt-8 text-xl font-semibold text-center -translate-x-1/2 left-1/2 bottom-5">
                    {anime.title.user_preferred} - Tập {episode.name}
                  </p>
                </div>
              )}
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
                {anime.title.user_preferred} - Tập {episode.name}
              </p>
              <p className="text-lg text-gray-300">{anime.description}</p>
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
        description,
        banner_image,
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
    .limit(200);

  const paths = data.map((anime: Anime) => ({
    params: { id: anime.ani_id.toString() },
  }));

  return { paths, fallback: "blocking" };
};

// @ts-ignore
WatchPage.getLayout = (page) => page;

export default WatchPage;

import Accordion from "@/components/shared/Accordion";
import EpisodeCard from "@/components/shared/EpisodeCard";
import Head from "@/components/shared/Head";
import Portal from "@/components/shared/Portal";
import Video from "@/components/shared/Video";
import EpisodesButton from "@/components/shared/Video/EpisodesButton";
import NextEpisodeButton from "@/components/shared/Video/NextEpisodeButton";
import useDevice from "@/hooks/useDevice";
import useEventListener from "@/hooks/useEventListener";
import { useFetchSource } from "@/hooks/useFetchSource";
import supabase from "@/lib/supabase";
import { Anime } from "@/types";
import { chunk } from "@/utils";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
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

  useEventListener("visibilitychange", () => {
    if (isMobile) return;

    if (!document.hidden) return;

    if (showInfoTimeout.current) {
      clearInterval(showInfoTimeout.current);
    }

    showInfoTimeout.current = setTimeout(() => {
      setShowInfoOverlay(true);
    }, 5000);
  });

  const sortedEpisodes = anime.episodes.sort(
    (a, b) => Number(a.name) - Number(b.name)
  );

  const { index: episodeIndex = 0, id } = router.query;

  const episode = sortedEpisodes[Number(episodeIndex)];
  const nextEpisode = sortedEpisodes[Number(episodeIndex) + 1];

  const handleNavigateEpisode = (index: number) => () => {
    router.replace(`/watch/${id}?index=${index}`, null, { shallow: true });
  };

  const { data, isLoading } = useFetchSource(episode.episode_id);

  return (
    <div className="relative w-full h-screen">
      <Head
        title={`${anime.title.user_preferred} (Tập ${episode.name}) - Kaguya`}
        description={`Xem phim ${anime.title.user_preferred} tập ${episode.name} tại Kaguya. Hoàn toàn miễn phí, không quảng cáo`}
        image={episode.thumbnail_image || anime.banner_image}
      />

      {isLoading && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <AiOutlineLoading3Quarters className="animate-spin text-primary-500 w-16 h-16" />
        </div>
      )}

      <Video
        src={isLoading ? blankVideo : data.url}
        className="object-contain w-full h-full"
        autoPlay
        overlaySlot={
          <BsArrowLeft
            className="absolute top-10 left-10 w-10 h-10 hover:text-gray-200 transition duration-300 cursor-pointer"
            onClick={router.back}
          />
        }
      />

      {/* Because Controls component cause too much rerender (rerender based on video playing) */}
      {/* It makes these two components perform really bad */}
      {/* This bring them to the right position, but not being rerender by the parent */}

      <Portal selector=".right-controls-slot">
        <NextEpisodeButton
          onClick={handleNavigateEpisode(Number(episodeIndex) + 1)}
        >
          <div className="w-96">
            <p className="text-xl">Tập tiếp theo</p>

            <EpisodeCard episode={nextEpisode} />
          </div>
        </NextEpisodeButton>

        <EpisodesButton>
          <div className="w-96 max-h-[40vh] overflow-y-scroll scroll-bar space-y-8">
            {chunk(sortedEpisodes, 12).map((chunk, index) => {
              const firstEpisode = chunk[0];
              const lastEpisode = chunk[chunk.length - 1];

              return (
                <Accordion
                  title={`Tập ${firstEpisode.name} - Tập ${lastEpisode.name}`}
                  key={index}
                >
                  {chunk.map((episode, index) => (
                    <EpisodeCard
                      episode={episode}
                      key={episode.episode_id}
                      onClick={handleNavigateEpisode(index)}
                      isActive={
                        Number(episode.name) - 1 === Number(episodeIndex) ||
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

      {showInfoOverlay && (
        <Portal>
          <div
            className="fixed inset-0 z-[9999] flex items-center bg-black/70"
            onMouseMove={() => setShowInfoOverlay(false)}
          >
            <div className="px-40 w-11/12">
              <p className="text-xl text-gray-200 mb-2">Bạn đang xem</p>
              <p className="text-5xl font-semibold mb-8">
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
        episodes(*)
      `
    )
    .eq("ani_id", Number(params.id))
    .single();

  console.log(error);

  if (error) {
    return { notFound: true };
  }

  return {
    props: {
      anime: data as Anime,
    },
    revalidate: 43200, // 12 hours
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

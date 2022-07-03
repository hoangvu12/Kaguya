import UploadContainer from "@/components/features/upload/UploadContainer";
import UploadLayout from "@/components/layouts/UploadLayout";
import HorizontalCard from "@/components/shared/HorizontalCard";
import Section from "@/components/shared/Section";
import StatisticBox from "@/components/shared/StatisticBox";
import withAdditionalUser from "@/hocs/withAdditionalUser";
import { getMedia } from "@/services/anilist";
import {
  AdditionalUser,
  AnimeSourceConnection,
  MangaSourceConnection,
  Source,
} from "@/types";
import { Media, MediaType } from "@/types/anilist";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { BiImage } from "react-icons/bi";

interface UploadPageProps {
  user: AdditionalUser;
  totalAnime: number;
  totalManga: number;
  recentlyUpdatedAnime: Media[];
  recentlyUpdatedManga: Media[];
}

const UploadPage: NextPage<UploadPageProps> = ({
  user,
  totalAnime,
  totalManga,
  recentlyUpdatedAnime = [],
  recentlyUpdatedManga = [],
}) => {
  return (
    <UploadContainer
      title={`Hi, ${user.user_metadata.name}!`}
      isVerified={user.isVerified}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <StatisticBox
          title="Số Anime đã upload"
          Icon={AiOutlineVideoCamera}
          value={totalAnime}
        />
        <StatisticBox
          title="Số Manga đã upload"
          Icon={BiImage}
          value={totalManga}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-4">
        <Section hasPadding={false} className="flex-1" title="Anime gần đây">
          <div className="bg-background-900 p-4">
            {recentlyUpdatedAnime.length ? (
              recentlyUpdatedAnime.map((media) => (
                <HorizontalCard
                  redirectUrl={`/upload/anime/${media.id}`}
                  key={media.id}
                  data={media}
                />
              ))
            ) : (
              <p className="text-center text-gray-300">Không có dữ liệu</p>
            )}
          </div>
        </Section>
        <Section hasPadding={false} className="flex-1" title="Manga gần đây">
          <div className="bg-background-900 p-4">
            {recentlyUpdatedManga.length ? (
              recentlyUpdatedManga.map((media) => (
                <HorizontalCard
                  redirectUrl={`/upload/manga/${media.id}`}
                  key={media.id}
                  data={media}
                />
              ))
            ) : (
              <p className="text-center text-gray-300">Không có dữ liệu</p>
            )}
          </div>
        </Section>
      </div>
    </UploadContainer>
  );
};

export default UploadPage;

// @ts-ignore
UploadPage.getLayout = (children) => <UploadLayout>{children}</UploadLayout>;

const getTotalUploadedMedia = async (sourceId: string) => {
  const animeSourcePromise = supabaseClient
    .from<AnimeSourceConnection>("kaguya_anime_source")
    .select("id", { count: "exact" })
    .eq("sourceId", sourceId);

  const mangaSourcePromise = supabaseClient
    .from<MangaSourceConnection>("kaguya_manga_source")
    .select("id", { count: "exact" })
    .eq("sourceId", sourceId);

  const [{ count: totalAnime }, { count: totalManga }] = await Promise.all([
    animeSourcePromise,
    mangaSourcePromise,
  ]);

  return {
    totalAnime,
    totalManga,
  };
};

const getRecentlyUpdatedMedia = async (sourceId: string) => {
  const episodeQuery = `
    mediaId,
    episodes:kaguya_episodes(
        updated_at
    )
  `;

  const chapterQuery = `
    mediaId,
    chapters:kaguya_chapters(
        updated_at
    )
  `;

  const animeSourcePromise = supabaseClient
    .from<AnimeSourceConnection>("kaguya_anime_source")
    .select(episodeQuery)
    .eq("sourceId", sourceId)
    .order("updated_at", { ascending: false, foreignTable: "kaguya_episodes" })
    .limit(5);

  const mangaSourcePromise = supabaseClient
    .from<MangaSourceConnection>("kaguya_manga_source")
    .select(chapterQuery)
    .eq("sourceId", sourceId)
    .order("updated_at", { ascending: false, foreignTable: "kaguya_chapters" })
    .limit(5);

  const [
    { data: animeSources = [], error: animeError },
    { data: mangaSources = [], error: mangaError },
  ] = await Promise.all([animeSourcePromise, mangaSourcePromise]);

  if (animeError) {
    throw animeError;
  }

  if (mangaError) {
    throw mangaError;
  }

  const animeIds = animeSources.map((source) => source?.mediaId);
  const mangaIds = mangaSources.map((source) => source?.mediaId);

  const mediaPromises: Promise<Media[]>[] = [];

  if (animeIds.length) {
    const animePromise = getMedia({
      id_in: animeIds,
      type: MediaType.Anime,
    });

    mediaPromises.push(animePromise);
  } else {
    // To keep promise position. [anime, manga]
    mediaPromises.push(Promise.resolve(null));
  }

  if (mangaIds.length) {
    const mangaPromise = getMedia({
      id_in: mangaIds,
      type: MediaType.Manga,
    });

    mediaPromises.push(mangaPromise);
  }

  if (!mediaPromises?.length) {
    return {
      anime: [],
      manga: [],
    };
  }

  const [anime = [], manga = []] = await Promise.all(mediaPromises);

  const sortedAnimeList = animeSources
    .map((connection) => {
      const media = anime.find((a) => a.id === connection.mediaId);

      return media;
    })
    .filter((a) => a);

  const sortedMangaList = mangaSources
    .map((connection) => {
      const media = manga.find((a) => a.id === connection.mediaId);

      return media;
    })
    .filter((a) => a);

  return {
    anime: sortedAnimeList || [],
    manga: sortedMangaList || [],
  };
};

export const getServerSideProps = withAdditionalUser({
  getServerSideProps: async (_, user) => {
    const { data: sourceAddedByUser, error } = await supabaseClient
      .from<Source>("kaguya_sources")
      .select("id")
      .eq("addedUserId", user.id)
      .single();

    if (!sourceAddedByUser?.id || error) {
      return {
        props: {
          totalAnime: 0,
          totalManga: 0,
        },
      };
    }

    const { totalAnime, totalManga } = await getTotalUploadedMedia(
      sourceAddedByUser.id
    );

    const { anime, manga } = await getRecentlyUpdatedMedia(
      sourceAddedByUser.id
    );

    return {
      props: {
        totalAnime,
        totalManga,
        recentlyUpdatedAnime: anime,
        recentlyUpdatedManga: manga,
      },
    };
  },
});

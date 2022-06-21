import UploadSection from "@/components/features/upload/UploadSection";
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
import { getUser, supabaseClient } from "@supabase/auth-helpers-nextjs";
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
    <UploadSection
      title={`Hi, ${user.user_metadata.name}!`}
      isVerified={user.isVerified}
      className="space-y-4"
    >
      <div className="flex gap-4">
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

      <div className="flex gap-4">
        <Section hasPadding={false} className="flex-1" title="Anime gần đây">
          <div className="bg-background-900 p-4">
            {recentlyUpdatedAnime.length ? (
              recentlyUpdatedAnime.map((media) => (
                <HorizontalCard key={media.id} data={media} />
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
                <HorizontalCard key={media.id} data={media} />
              ))
            ) : (
              <p className="text-center text-gray-300">Không có dữ liệu</p>
            )}
          </div>
        </Section>
      </div>
    </UploadSection>
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
  const animeSourcePromise = supabaseClient
    .from<AnimeSourceConnection>("kaguya_anime_source")
    .select("mediaId")
    .eq("sourceId", sourceId)
    .order("updated_at", { ascending: false })
    .limit(5);

  const mangaSourcePromise = supabaseClient
    .from<MangaSourceConnection>("kaguya_manga_source")
    .select("mediaId")
    .eq("sourceId", sourceId)
    .order("updated_at", { ascending: false })
    .limit(5);

  const [{ data: animeSources }, { data: mangaSources }] = await Promise.all([
    animeSourcePromise,
    mangaSourcePromise,
  ]);

  const animeIds = animeSources.map((source) => source.mediaId);
  const mangaIds = mangaSources.map((source) => source.mediaId);

  const mediaPromises = [];

  if (animeIds.length) {
    const animePromise = getMedia({
      id_in: animeIds,
      type: MediaType.Anime,
    });

    mediaPromises.push(animePromise);
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
      anime: 0,
      manga: 0,
    };
  }

  const [anime = 0, manga = 0] = await Promise.all(mediaPromises);

  return {
    anime,
    manga,
  };
};

export const getServerSideProps = withAdditionalUser({
  getServerSideProps: async (ctx) => {
    const { user } = await getUser(ctx);

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

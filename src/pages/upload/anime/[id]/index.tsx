import MediaDetails from "@/components/features/upload/MediaDetails";
import UploadContainer from "@/components/features/upload/UploadContainer";
import UploadLayout from "@/components/layouts/UploadLayout";
import BaseButton from "@/components/shared/BaseButton";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import { UploadMediaProvider } from "@/contexts/UploadMediaContext";
import withAdditionalUser from "@/hocs/withAdditionalUser";
import useMediaDetails from "@/hooks/useMediaDetails";
import useUploadedEpisodes from "@/hooks/useUploadedEpisodes";
import { AdditionalUser, Source } from "@/types";
import { MediaType } from "@/types/anilist";
import { sortMediaUnit } from "@/utils/data";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import Link from "next/link";
import { useMemo } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

interface UploadAnimePageProps {
  user: AdditionalUser;
  sourceId: string;
  mediaId: number;
}

const UploadAnimePage: NextPage<UploadAnimePageProps> = ({
  user,
  sourceId,
  mediaId,
}) => {
  const { data: anime, isLoading: mediaLoading } = useMediaDetails({
    type: MediaType.Anime,
    id: mediaId,
  });

  const { data: uploadedEpisodes, isLoading: episodesLoading } =
    useUploadedEpisodes({
      mediaId,
      sourceId,
    });

  const sortedEpisodes = useMemo(() => {
    if (episodesLoading) return [];

    return sortMediaUnit(uploadedEpisodes);
  }, [episodesLoading, uploadedEpisodes]);

  return (
    <UploadContainer isVerified={user.isVerified}>
      {mediaLoading || episodesLoading ? (
        <Loading />
      ) : (
        <UploadMediaProvider value={{ sourceId, mediaId }}>
          <div className="space-y-8">
            <MediaDetails media={anime} />

            <div className="mt-8">
              <Link href={`/upload/anime/${mediaId}/episodes/create`}>
                <a>
                  <Button
                    LeftIcon={IoIosAddCircleOutline}
                    primary
                    className="ml-auto mb-4"
                  >
                    Tập mới
                  </Button>
                </a>
              </Link>

              <div className="space-y-2">
                {sortedEpisodes.map((episode) => (
                  <Link
                    key={episode.slug}
                    href={`/upload/anime/${mediaId}/episodes/${episode.slug}`}
                  >
                    <a className="block">
                      <BaseButton className="p-3 w-full !bg-background-900 hover:!bg-white/20 rounded-md">
                        {episode.name}
                      </BaseButton>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </UploadMediaProvider>
      )}
    </UploadContainer>
  );
};

export default UploadAnimePage;

export const getServerSideProps = withAdditionalUser({
  async getServerSideProps(ctx, user) {
    try {
      const { data: sourceAddedByUser, error } = await supabaseClient
        .from<Source>("kaguya_sources")
        .select("id")
        .eq("addedUserId", user.id)
        .single();

      if (error || !sourceAddedByUser?.id) {
        throw error;
      }

      return {
        props: {
          sourceId: sourceAddedByUser.id,
          mediaId: ctx.query.id,
        },
      };
    } catch (err) {
      return {
        redirect: {
          statusCode: 302,
          destination: "/login",
        },
      };
    }
  },
});

// @ts-ignore
UploadAnimePage.getLayout = (children) => (
  <UploadLayout>{children}</UploadLayout>
);

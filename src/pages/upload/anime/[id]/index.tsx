import React from "react";

import MediaDetails from "@/components/features/upload/MediaDetails";
import UploadContainer from "@/components/features/upload/UploadContainer";
import UploadLayout from "@/components/layouts/UploadLayout";
import BaseButton from "@/components/shared/BaseButton";
import Button from "@/components/shared/Button";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import Loading from "@/components/shared/Loading";
import Section from "@/components/shared/Section";
import { UploadMediaProvider } from "@/contexts/UploadMediaContext";
import withAdditionalUser from "@/hocs/withAdditionalUser";
import useAnimeSourceDelete from "@/hooks/useAnimeSourceDelete";
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
import { useQueryClient } from "react-query";

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

  const queryClient = useQueryClient();

  const { mutateAsync: animeSourceDelete, isLoading: deleteLoading } =
    useAnimeSourceDelete(`${sourceId}-${mediaId}`);

  const { data: uploadedEpisodes, isLoading: episodesLoading } =
    useUploadedEpisodes({
      mediaId,
      sourceId,
    });

  const sortedEpisodes = useMemo(() => {
    if (episodesLoading) return [];

    return sortMediaUnit(uploadedEpisodes);
  }, [episodesLoading, uploadedEpisodes]);

  const handleConfirm = async () => {
    await animeSourceDelete(null, {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "uploaded-episodes",
          { mediaId, sourceId },
        ]);
      },
    });
  };

  return (
    <React.Fragment>
      <UploadContainer className="pb-12" isVerified={user.isVerified}>
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
                      <a className="relative block">
                        <BaseButton className="p-3 w-full !bg-background-900 hover:!bg-white/20 rounded-md">
                          {episode.name}
                        </BaseButton>

                        {!episode.published && (
                          <span className="rounded-md top-1/2 -translate-y-1/2 px-2 py-1 bg-primary-700 absolute right-5">
                            Chưa đăng tải
                          </span>
                        )}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </UploadMediaProvider>
        )}
      </UploadContainer>

      {!mediaLoading && (
        <Section className="fixed bottom-0 py-3 flex justify-end gap-2 items-center bg-background-800 w-full md:w-4/5">
          <DeleteConfirmation
            onConfirm={handleConfirm}
            className="space-y-4"
            confirmString={anime.title.userPreferred}
            isLoading={deleteLoading}
          >
            <h1 className="text-2xl font-semibold">
              Bạn có chắc chắn xóa không?
            </h1>

            <p>
              Một khi đã xóa, bạn sẽ không thể khôi phục lại. Điều này sẽ xóa
              hoàn toàn bất kỳ dữ liệu nào liên quan đến anime này.
            </p>
          </DeleteConfirmation>
        </Section>
      )}
    </React.Fragment>
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

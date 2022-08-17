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
import useMediaDetails from "@/hooks/useMediaDetails";
import useUploadedChapters from "@/hooks/useUploadedChapters";
import { AdditionalUser, Source } from "@/types";
import { MediaType } from "@/types/anilist";
import { sortMediaUnit } from "@/utils/data";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import Link from "next/link";
import { useMemo } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import useMangaSourceDelete from "@/hooks/useMangaSourceDelete";
import { useQueryClient } from "react-query";

interface UploadMangaPageProps {
  user: AdditionalUser;
  sourceId: string;
  mediaId: number;
}

const UploadMangaPage: NextPage<UploadMangaPageProps> = ({
  user,
  sourceId,
  mediaId,
}) => {
  const { data: manga, isLoading: mediaLoading } = useMediaDetails({
    type: MediaType.Manga,
    id: mediaId,
  });

  const queryClient = useQueryClient();

  const { mutate: mangaSourceDelete, isLoading: deleteLoading } =
    useMangaSourceDelete(`${sourceId}-${mediaId}`);

  const { data: uploadedChapters, isLoading: chaptersLoading } =
    useUploadedChapters({
      mediaId,
      sourceId,
    });

  const sortedChapters = useMemo(() => {
    if (chaptersLoading) return [];

    return sortMediaUnit(uploadedChapters);
  }, [chaptersLoading, uploadedChapters]);

  const handleConfirm = () => {
    mangaSourceDelete(null, {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "uploaded-chapters",
          { mediaId, sourceId },
        ]);
      },
    });
  };

  return (
    <React.Fragment>
      <UploadContainer className="pb-12" isVerified={user.isVerified}>
        {mediaLoading || chaptersLoading ? (
          <Loading />
        ) : (
          <UploadMediaProvider value={{ sourceId, mediaId }}>
            <div className="space-y-8">
              <MediaDetails media={manga} />

              <div className="mt-8">
                <Link href={`/upload/manga/${mediaId}/chapters/create`}>
                  <a>
                    <Button
                      LeftIcon={IoIosAddCircleOutline}
                      primary
                      className="ml-auto mb-4"
                    >
                      Chapter mới
                    </Button>
                  </a>
                </Link>

                <div className="space-y-2">
                  {sortedChapters.map((chapter) => (
                    <Link
                      key={chapter.slug}
                      href={`/upload/manga/${mediaId}/chapters/${chapter.slug}`}
                    >
                      <a className="block">
                        <BaseButton className="text-left p-3 w-full !bg-background-900 hover:!bg-white/20 rounded-md">
                          {chapter.name}
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

      {!mediaLoading && (
        <Section className="fixed bottom-0 py-3 flex justify-end gap-2 items-center bg-background-800 w-full md:w-4/5">
          <DeleteConfirmation
            onConfirm={handleConfirm}
            className="space-y-4"
            confirmString={manga.title.userPreferred}
          >
            <h1 className="text-2xl font-semibold">
              Bạn có chắc chắn xóa không?
            </h1>

            <p>
              Một khi đã xóa, bạn sẽ không thể khôi phục lại. Điều này sẽ xóa
              hoàn toàn bất kỳ dữ liệu nào liên quan đến manga này.
            </p>
          </DeleteConfirmation>
        </Section>
      )}
    </React.Fragment>
  );
};

export default UploadMangaPage;

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
UploadMangaPage.getLayout = (children) => (
  <UploadLayout>{children}</UploadLayout>
);

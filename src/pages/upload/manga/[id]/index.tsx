import MediaDetails from "@/components/features/upload/MediaDetails";
import UploadContainer from "@/components/features/upload/UploadContainer";
import UploadLayout from "@/components/layouts/UploadLayout";
import AddTranslationModal from "@/components/shared/AddTranslationModal";
import BaseButton from "@/components/shared/BaseButton";
import Button from "@/components/shared/Button";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import Link from "@/components/shared/Link";
import Loading from "@/components/shared/Loading";
import Section from "@/components/shared/Section";
import { UploadMediaProvider } from "@/contexts/UploadMediaContext";
import withAdditionalUser from "@/hocs/withAdditionalUser";
import useMangaSourceDelete from "@/hooks/useMangaSourceDelete";
import useMediaDetails from "@/hooks/useMediaDetails";
import useUploadedChapters from "@/hooks/useUploadedChapters";
import { AdditionalUser, Source } from "@/types";
import { MediaType } from "@/types/anilist";
import { getDescription, getTitle, sortMediaUnit } from "@/utils/data";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { AiFillDelete } from "react-icons/ai";
import { IoIosAddCircleOutline } from "react-icons/io";
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

  const { locale } = useRouter();

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

  const title = useMemo(() => getTitle(manga, locale), [manga, locale]);
  const description = useMemo(
    () => getDescription(manga, locale),
    [manga, locale]
  );

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
                <div className="w-full flex justify-end items-center gap-x-2 [&>*]:w-max mb-8">
                  <Link href={`/upload/manga/${mediaId}/chapters/create`}>
                    <a>
                      <Button LeftIcon={IoIosAddCircleOutline} primary>
                        New chapter
                      </Button>
                    </a>
                  </Link>

                  <AddTranslationModal
                    mediaId={mediaId}
                    mediaType={MediaType.Manga}
                    defaultDescription={description}
                    defaultTitle={title}
                  />
                </div>

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
            reference={
              <Button
                LeftIcon={AiFillDelete}
                isLoading={deleteLoading}
                className="text-red-500 bg-red-500/20 hover:text-white hover:bg-red-500/80"
              >
                Delete
              </Button>
            }
          >
            <h1 className="text-2xl font-semibold">
              Are you sure to delete the Manga?
            </h1>

            <p>
              Once deleted, you cannot restore it. This will delete absolutely
              any data related to this Manga.
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

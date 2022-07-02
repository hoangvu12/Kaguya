import MediaDetails from "@/components/features/upload/MediaDetails";
import UploadContainer from "@/components/features/upload/UploadContainer";
import UploadLayout from "@/components/layouts/UploadLayout";
import BaseButton from "@/components/shared/BaseButton";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
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

  const { data: uploadedChapters, isLoading: chaptersLoading } =
    useUploadedChapters({
      mediaId,
      sourceId,
    });

  const sortedChapters = useMemo(() => {
    if (chaptersLoading) return [];

    return sortMediaUnit(uploadedChapters);
  }, [chaptersLoading, uploadedChapters]);

  return (
    <UploadContainer isVerified={user.isVerified}>
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

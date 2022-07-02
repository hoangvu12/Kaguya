import ChapterNameUpdate from "@/components/features/upload/ChapterNameUpdate";
import ImageUpdate from "@/components/features/upload/ImageUpdate";
import UploadContainer from "@/components/features/upload/UploadContainer";
import UploadSection from "@/components/features/upload/UploadSection";
import UploadLayout from "@/components/layouts/UploadLayout";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import Section from "@/components/shared/Section";
import { supportedUploadImageFormats } from "@/constants";
import { UploadMediaProvider } from "@/contexts/UploadMediaContext";
import withAdditionalUser from "@/hocs/withAdditionalUser";
import useUploadedChapter from "@/hooks/useUploadedChapter";
import { AdditionalUser, Source } from "@/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import Link from "next/link";
import { useMemo } from "react";

interface UploadChapterEditPageProps {
  user: AdditionalUser;
  sourceId: string;
  mediaId: number;
  chapterSlug: string;
}

const UploadChapterEditPage: NextPage<UploadChapterEditPageProps> = ({
  mediaId,
  sourceId,
  chapterSlug,
  user,
}) => {
  const { data, isLoading } = useUploadedChapter(chapterSlug);

  const chapterId = useMemo(() => chapterSlug.split("-")[1], [chapterSlug]);

  return (
    <UploadMediaProvider value={{ mediaId, sourceId }}>
      <UploadContainer className="pb-8" isVerified={user.isVerified}>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="space-y-16">
            <UploadSection>
              <UploadSection.Left>
                <label className="font-semibold text-2xl">Tập phim</label>
              </UploadSection.Left>

              <UploadSection.Right>
                <ChapterNameUpdate
                  initialName={data.name}
                  chapterSlug={data.slug}
                />
              </UploadSection.Right>
            </UploadSection>

            <UploadSection>
              <UploadSection.Left>
                <label className="font-semibold text-2xl">Hình ảnh</label>
                <p className="text-sm text-gray-300">
                  Hỗ trợ {supportedUploadImageFormats.join(", ")}
                </p>
              </UploadSection.Left>

              <UploadSection.Right className="relative space-y-1">
                <ImageUpdate
                  initialImages={data.images[0].images}
                  chapterSlug={chapterSlug}
                />
              </UploadSection.Right>
            </UploadSection>
          </div>
        )}
      </UploadContainer>

      <Section className="py-3 flex justify-end gap-2 items-center fixed bottom-0 w-full md:w-4/5 bg-background-800">
        <Link href={`/upload/manga/${mediaId}/chapters/create`}>
          <a>
            <Button secondary>Tạo chương mới</Button>
          </a>
        </Link>

        <Link href={`/manga/read/${mediaId}/${sourceId}/${chapterId}`}>
          <a>
            <Button primary>Xem chương</Button>
          </a>
        </Link>
      </Section>
    </UploadMediaProvider>
  );
};

export default UploadChapterEditPage;

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
          chapterSlug: ctx.query.chapterSlug,
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
UploadChapterEditPage.getLayout = (children) => (
  <UploadLayout>{children}</UploadLayout>
);

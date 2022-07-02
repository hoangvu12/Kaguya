import ChapterNameUpload from "@/components/features/upload/ChapterNameUpload";
import ImageUpload from "@/components/features/upload/ImageUpload";
import UploadContainer from "@/components/features/upload/UploadContainer";
import UploadSection from "@/components/features/upload/UploadSection";
import UploadLayout from "@/components/layouts/UploadLayout";
import Button from "@/components/shared/Button";
import Section from "@/components/shared/Section";
import { supportedUploadImageFormats } from "@/constants";
import withAdditionalUser from "@/hocs/withAdditionalUser";
import useCreateChapter from "@/hooks/useCreateChapter";
import { AdditionalUser, Source } from "@/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import React, { useState } from "react";

interface UploadCreateChapterPageProps {
  user: AdditionalUser;
  sourceId: string;
  mediaId: number;
}

const UploadCreateChapterPage: NextPage<UploadCreateChapterPageProps> = ({
  mediaId,
  sourceId,
  user,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [chapterName, setChapterName] = useState("");

  const { mutate: createChapter } = useCreateChapter({
    mediaId,
    sourceId,
  });

  const onSubmit = () => {
    createChapter({
      chapterName,
      images,
    });
  };

  return (
    <React.Fragment>
      <UploadContainer className="pb-12" isVerified={user.isVerified}>
        <div className="space-y-16">
          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Chương</label>
            </UploadSection.Left>

            <UploadSection.Right>
              <ChapterNameUpload onChange={setChapterName} />
            </UploadSection.Right>
          </UploadSection>

          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Hình ảnh</label>
              <p className="text-sm text-gray-300">
                Hỗ trợ {supportedUploadImageFormats.join(", ")}
              </p>
            </UploadSection.Left>

            <UploadSection.Right>
              <ImageUpload onChange={setImages} />
            </UploadSection.Right>
          </UploadSection>
        </div>
      </UploadContainer>

      <Section className="py-3 flex justify-end gap-2 items-center fixed bottom-0 w-full md:w-4/5 bg-background-800">
        <Button onClick={onSubmit} primary>
          Upload
        </Button>
      </Section>
    </React.Fragment>
  );
};

export default UploadCreateChapterPage;

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
UploadCreateChapterPage.getLayout = (children) => (
  <UploadLayout>{children}</UploadLayout>
);

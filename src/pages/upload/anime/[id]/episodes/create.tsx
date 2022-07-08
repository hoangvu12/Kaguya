import EpisodeNameUpload from "@/components/features/upload/EpisodeNameUpload";
import FontUpload from "@/components/features/upload/FontUpload";
import SubtitleUpload, {
  SubtitleFile,
} from "@/components/features/upload/SubtitleUpload";
import UploadContainer from "@/components/features/upload/UploadContainer";
import UploadSection from "@/components/features/upload/UploadSection";
import VideoUpload, {
  VideoState,
} from "@/components/features/upload/VideoUpload";
import UploadLayout from "@/components/layouts/UploadLayout";
import Button from "@/components/shared/Button";
import Section from "@/components/shared/Section";
import {
  supportedUploadSubtitleFormats,
  supportedUploadVideoFormats,
} from "@/constants";
import withAdditionalUser from "@/hocs/withAdditionalUser";
import useCreateEpisode from "@/hooks/useCreateEpisode";
import { AdditionalUser, Source } from "@/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import React, { useState } from "react";

interface UploadCreateEpisodePageProps {
  user: AdditionalUser;
  sourceId: string;
  mediaId: number;
}

const UploadCreateEpisodePage: NextPage<UploadCreateEpisodePageProps> = ({
  mediaId,
  sourceId,
  user,
}) => {
  const [videoState, setVideoState] = useState<VideoState>(null);
  const [subtitles, setSubtitles] = useState<SubtitleFile[]>([]);
  const [fonts, setFonts] = useState<File[]>([]);
  const [episodeName, setEpisodeName] = useState("");

  const { mutate: createEpisode } = useCreateEpisode({
    mediaId,
    sourceId,
  });

  const onSubmit = () => {
    console.log(videoState);

    createEpisode({
      episodeName,
      fonts,
      subtitles,
      video: videoState.video,
      hostingId: videoState.hostingId,
    });
  };

  return (
    <React.Fragment>
      <UploadContainer className="pb-12" isVerified={user.isVerified}>
        <div className="space-y-16">
          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Tập phim</label>
            </UploadSection.Left>

            <UploadSection.Right>
              <EpisodeNameUpload onChange={setEpisodeName} />
            </UploadSection.Right>
          </UploadSection>

          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Video</label>
              <p className="text-sm text-gray-300">
                Hỗ trợ {supportedUploadVideoFormats.join(", ")}
              </p>
            </UploadSection.Left>

            <UploadSection.Right>
              <VideoUpload onChange={setVideoState} />
            </UploadSection.Right>
          </UploadSection>

          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Subtitles</label>
              <p className="text-sm text-gray-300">
                Hỗ trợ {supportedUploadSubtitleFormats.join(", ")}
              </p>
            </UploadSection.Left>

            <UploadSection.Right>
              <SubtitleUpload onChange={setSubtitles} />
            </UploadSection.Right>
          </UploadSection>

          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Fonts</label>
              <p className="text-sm text-gray-300">
                Fonts chỉ dành cho subtitle .ass
              </p>
            </UploadSection.Left>

            <UploadSection.Right>
              <FontUpload onChange={setFonts} />
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

export default UploadCreateEpisodePage;

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
UploadCreateEpisodePage.getLayout = (children) => (
  <UploadLayout>{children}</UploadLayout>
);

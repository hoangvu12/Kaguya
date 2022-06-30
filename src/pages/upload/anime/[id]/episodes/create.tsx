import Button from "@/components/shared/Button";
import EpisodeNameUpload from "@/components/features/upload/EpisodeNameUpload";
import FontUpload from "@/components/features/upload/FontUpload";
import SubtitleUpload, {
  SubtitleFile,
} from "@/components/features/upload/SubtitleUpload";
import UploadContainer from "@/components/features/upload/UploadContainer";
import VideoUpload from "@/components/features/upload/VideoUpload";
import UploadLayout from "@/components/layouts/UploadLayout";
import {
  supportedUploadSubtitleFormats,
  supportedUploadVideoFormats,
} from "@/constants";
import withAdditionalUser from "@/hocs/withAdditionalUser";
import useCreateEpisode from "@/hooks/useCreateEpisode";
import { AdditionalUser, Source } from "@/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import UploadSection from "@/components/features/upload/UploadSection";

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
  const { handleSubmit } = useForm();
  const [video, setVideo] = useState<string | File>(null);
  const [subtitles, setSubtitles] = useState<SubtitleFile[]>([]);
  const [fonts, setFonts] = useState<File[]>([]);
  const [episodeName, setEpisodeName] = useState("");

  const { mutate: createEpisode } = useCreateEpisode({
    mediaId,
    sourceId,
  });

  const onSubmit = () => {
    createEpisode({
      episodeName,
      fonts,
      subtitles,
      video,
    });
  };

  return (
    <UploadContainer isVerified={user.isVerified}>
      <form className="space-y-16" onSubmit={handleSubmit(onSubmit)}>
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
            <VideoUpload onChange={setVideo} />
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

        <Button type="submit" className="ml-auto" primary>
          Upload
        </Button>
      </form>
    </UploadContainer>
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

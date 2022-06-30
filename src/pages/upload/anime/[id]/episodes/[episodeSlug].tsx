import EpisodeNameUpdate from "@/components/features/upload/EpisodeNameUpdate";
import FontUpdate from "@/components/features/upload/FontUpdate";
import SubtitleUpdate from "@/components/features/upload/SubtitleUpdate";
import UploadContainer from "@/components/features/upload/UploadContainer";
import UploadSection from "@/components/features/upload/UploadSection";
import VideoUpdate from "@/components/features/upload/VideoUpdate";
import UploadLayout from "@/components/layouts/UploadLayout";
import Loading from "@/components/shared/Loading";
import {
  supportedUploadSubtitleFormats,
  supportedUploadVideoFormats,
} from "@/constants";
import { UploadMediaProvider } from "@/contexts/UploadMediaContext";
import withAdditionalUser from "@/hocs/withAdditionalUser";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import useUploadedEpisode from "@/hooks/useUploadedEpisode";
import useVideoStatus from "@/hooks/useVideoStatus";
import { AdditionalUser, Source } from "@/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import React from "react";

interface UploadEpisodeEditPageProps {
  user: AdditionalUser;
  sourceId: string;
  mediaId: number;
  episodeSlug: string;
}

const UploadEpisodeEditPage: NextPage<UploadEpisodeEditPageProps> = ({
  mediaId,
  sourceId,
  episodeSlug,
  user,
}) => {
  const { VIDEO_STATUS_TRANSLATIONS } = useConstantTranslation();
  const { data, isLoading } = useUploadedEpisode(episodeSlug);
  const { data: videoStatus, isLoading: videoStatusLoading } = useVideoStatus(
    data?.video?.[0]?.video?.hashid
  );

  return (
    <UploadContainer isVerified={user.isVerified}>
      <UploadMediaProvider value={{ mediaId, sourceId }}>
        {isLoading || videoStatusLoading ? (
          <Loading />
        ) : (
          <div className="space-y-16">
            <UploadSection>
              <UploadSection.Left>
                <label className="font-semibold text-2xl">Tập phim</label>
              </UploadSection.Left>

              <UploadSection.Right>
                <EpisodeNameUpdate
                  initialName={data.name}
                  episodeSlug={data.slug}
                />
              </UploadSection.Right>
            </UploadSection>

            <UploadSection>
              <UploadSection.Left>
                <label className="font-semibold text-2xl">Video</label>
                <p className="text-sm text-gray-300">
                  Hỗ trợ {supportedUploadVideoFormats.join(", ")}
                </p>
              </UploadSection.Left>

              <UploadSection.Right className="space-y-1">
                <p>
                  Tình trạng video:{" "}
                  {videoStatusLoading
                    ? "Vui lòng chờ"
                    : VIDEO_STATUS_TRANSLATIONS[videoStatus.status]}
                </p>

                <VideoUpdate
                  initialVideo={videoStatus}
                  episodeSlug={episodeSlug}
                />
              </UploadSection.Right>
            </UploadSection>

            <UploadSection>
              <UploadSection.Left>
                <label className="font-semibold text-2xl">Subtitles</label>
                <p className="text-sm text-gray-300">
                  Hỗ trợ {supportedUploadSubtitleFormats.join(", ")}
                </p>
              </UploadSection.Left>

              <UploadSection.Right className="relative">
                <SubtitleUpdate
                  episodeSlug={episodeSlug}
                  initialSubtitles={data.video[0].subtitles}
                />
              </UploadSection.Right>
            </UploadSection>

            <UploadSection>
              <UploadSection.Left>
                <label className="font-semibold text-2xl">Fonts</label>
                <p className="text-sm text-gray-300">
                  Fonts chỉ dành cho subtitle .ass
                </p>
              </UploadSection.Left>

              <UploadSection.Right className="relative">
                <FontUpdate
                  episodeSlug={episodeSlug}
                  initialFonts={data.video[0].fonts}
                />
              </UploadSection.Right>
            </UploadSection>
          </div>
        )}
      </UploadMediaProvider>
    </UploadContainer>
  );
};

export default UploadEpisodeEditPage;

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
          episodeSlug: ctx.query.episodeSlug,
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
UploadEpisodeEditPage.getLayout = (children) => (
  <UploadLayout>{children}</UploadLayout>
);

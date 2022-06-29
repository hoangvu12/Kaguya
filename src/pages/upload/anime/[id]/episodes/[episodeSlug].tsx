import EpisodeNameUpdate from "@/components/features/upload/EpisodeNameUpdate";
import FontUpdate from "@/components/features/upload/FontUpdate";
import SubtitleUpdate from "@/components/features/upload/SubtitleUpdate";
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
import useUploadedEpisode from "@/hooks/useUploadedEpisode";
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
  const { data, isLoading } = useUploadedEpisode(episodeSlug);

  return (
    <UploadSection isVerified={user.isVerified}>
      <UploadMediaProvider value={{ mediaId, sourceId }}>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="space-y-16">
            <div className="flex justify-between gap-x-32">
              <div className="w-1/3 grow-0">
                <label className="font-semibold text-2xl">Tập phim</label>
              </div>

              <div className="w-2/3 shrink-0">
                <EpisodeNameUpdate
                  initialName={data.name}
                  episodeSlug={data.slug}
                />
              </div>
            </div>

            <div className="flex justify-between gap-x-32">
              <div className="w-1/3 grow-0">
                <label className="font-semibold text-2xl">Video</label>
                <p className="text-sm text-gray-300">
                  Hỗ trợ {supportedUploadVideoFormats.join(", ")}
                </p>
              </div>

              <div className="w-2/3 shrink-0">
                <VideoUpdate
                  initialVideo={data.video[0].video}
                  episodeSlug={episodeSlug}
                />
              </div>
            </div>

            <div className="flex justify-between gap-x-32">
              <div className="w-1/3 grow-0">
                <label className="font-semibold text-2xl">Subtitles</label>
                <p className="text-sm text-gray-300">
                  Hỗ trợ {supportedUploadSubtitleFormats.join(", ")}
                </p>
              </div>

              <div className="relative w-2/3 shrink-0">
                <SubtitleUpdate
                  episodeSlug={episodeSlug}
                  initialSubtitles={data.video[0].subtitles}
                />
              </div>
            </div>

            <div className="flex justify-between gap-x-32">
              <div className="w-1/3 grow-0">
                <label className="font-semibold text-2xl">Fonts</label>
                <p className="text-sm text-gray-300">
                  Fonts chỉ dành cho subtitle .ass
                </p>
              </div>

              <div className="w-2/3 shrink-0">
                <FontUpdate
                  episodeSlug={episodeSlug}
                  initialFonts={data.video[0].fonts}
                />
              </div>
            </div>
          </div>
        )}
      </UploadMediaProvider>
    </UploadSection>
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

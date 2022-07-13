import EpisodeNameUpdate from "@/components/features/upload/EpisodeNameUpdate";
import FontUpdate from "@/components/features/upload/FontUpdate";
import SubtitleUpdate from "@/components/features/upload/SubtitleUpdate";
import UploadContainer from "@/components/features/upload/UploadContainer";
import UploadSection from "@/components/features/upload/UploadSection";
import VideoUpdate from "@/components/features/upload/VideoUpdate";
import UploadLayout from "@/components/layouts/UploadLayout";
import Button from "@/components/shared/Button";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import Loading from "@/components/shared/Loading";
import Section from "@/components/shared/Section";
import {
  supportedUploadSubtitleFormats,
  supportedUploadVideoFormats,
} from "@/constants";
import { UploadMediaProvider } from "@/contexts/UploadMediaContext";
import withAdditionalUser from "@/hocs/withAdditionalUser";
import useEpisodeDelete from "@/hooks/useEpisodeDelete";
import usePublishEpisode from "@/hooks/usePublishEpisode";
import useUploadedEpisode from "@/hooks/useUploadedEpisode";
import useVideoStatus from "@/hooks/useVideoStatus";
import { AdditionalUser, Source } from "@/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useQueryClient } from "react-query";

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
  const { mutate: deleteEpisode, isLoading: deleteLoading } =
    useEpisodeDelete(episodeSlug);
  const { mutate: publishEpisode, isLoading: publishLoading } =
    usePublishEpisode(episodeSlug);
  const { data: videoStatus, isLoading: videoStatusLoading } = useVideoStatus(
    data?.video?.[0]?.video?.id,
    data?.video?.[0]?.hostingId
  );
  const router = useRouter();
  const queryClient = useQueryClient();

  const episodeId = useMemo(() => episodeSlug.split("-")[1], [episodeSlug]);

  const handleDelete = () => {
    deleteEpisode(null, {
      onSuccess: () => {
        router.replace(`/upload/anime/${mediaId}`);
      },
    });
  };

  const handlePublish = () => {
    publishEpisode(null, {
      onSuccess: () => {
        queryClient.invalidateQueries(["uploaded-episode", episodeSlug]);
      },
    });
  };

  return (
    <UploadMediaProvider value={{ mediaId, sourceId }}>
      <UploadContainer className="pb-8" isVerified={user.isVerified}>
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
                  {videoStatus.converted ? "Đã chuyển đổi" : "Đang chuyển đổi"}
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
      </UploadContainer>

      {!isLoading && !videoStatusLoading && (
        <Section className="py-3 flex justify-between items-center fixed bottom-0 w-full md:w-4/5 bg-background-800">
          <DeleteConfirmation
            isLoading={deleteLoading}
            onConfirm={handleDelete}
            className="space-y-4"
            confirmString={data.name}
          >
            <h1 className="text-2xl font-semibold">
              Bạn có chắc chắn xóa không?
            </h1>

            <p>
              Một khi đã xóa, bạn sẽ không thể khôi phục lại. Điều này sẽ xóa
              hoàn toàn bất kỳ dữ liệu nào liên quan đến tập này.
            </p>
          </DeleteConfirmation>

          <div className="flex gap-2 items-center">
            <p>
              Tình trạng tập phim: {data.published ? "Đã đăng" : "Chưa đăng"}
            </p>

            <Link href={`/upload/anime/${mediaId}/episodes/create`}>
              <a>
                <Button className="!bg-gray-600 hover:!bg-opacity-80">
                  Tạo tập mới
                </Button>
              </a>
            </Link>

            {data.published ? (
              <Link href={`/anime/watch/${mediaId}/${sourceId}/${episodeId}`}>
                <a>
                  <Button primary>Xem tập phim</Button>
                </a>
              </Link>
            ) : (
              <Button
                isLoading={publishLoading}
                primary
                disabled={!videoStatus.converted}
                onClick={handlePublish}
              >
                Đăng tập phim
              </Button>
            )}
          </div>
        </Section>
      )}
    </UploadMediaProvider>
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

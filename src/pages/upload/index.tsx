import UploadSection from "@/components/features/upload/UploadSection";
import UploadLayout from "@/components/layouts/UploadLayout";
import StatisticBox from "@/components/shared/StatisticBox";
import withAdditionalUser from "@/hocs/withAdditionalUser";
import {
  AdditionalUser,
  AnimeSourceConnection,
  MangaSourceConnection,
  Source,
} from "@/types";
import { getUser, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { BiImage } from "react-icons/bi";

interface UploadPageProps {
  user: AdditionalUser;
  animeCount: number;
  mangaCount: number;
}

const UploadPage: NextPage<UploadPageProps> = ({
  user,
  animeCount,
  mangaCount,
}) => {
  return (
    <UploadSection
      title={`Hi, ${user.user_metadata.name}!`}
      isVerified={user.isVerified}
      className="space-y-4"
    >
      <StatisticBox
        title="Số Anime đã upload"
        Icon={AiOutlineVideoCamera}
        value={animeCount}
      />
      <StatisticBox
        title="Số Manga đã upload"
        Icon={BiImage}
        value={mangaCount}
      />
    </UploadSection>
  );
};

export default UploadPage;

// @ts-ignore
UploadPage.getLayout = (children) => <UploadLayout>{children}</UploadLayout>;

export const getServerSideProps = withAdditionalUser({
  getServerSideProps: async (ctx) => {
    const { user } = await getUser(ctx);

    const { data: sourceAddedByUser, error } = await supabaseClient
      .from<Source>("kaguya_sources")
      .select("id")
      .eq("addedUserId", user.id)
      .single();

    if (!sourceAddedByUser?.id || error) {
      return {
        props: {
          animeCount: 0,
          mangaCount: 0,
        },
      };
    }

    const animeSourcePromise = supabaseClient
      .from<AnimeSourceConnection>("kaguya_anime_source")
      .select("id", { count: "exact" })
      .eq("sourceId", sourceAddedByUser.id);

    const mangaSourcePromise = supabaseClient
      .from<MangaSourceConnection>("kaguya_manga_source")
      .select("id", { count: "exact" })
      .eq("sourceId", sourceAddedByUser.id);

    const [{ count: animeCount }, { count: mangaCount }] = await Promise.all([
      animeSourcePromise,
      mangaSourcePromise,
    ]);

    return {
      props: {
        animeCount,
        mangaCount,
      },
    };
  },
});

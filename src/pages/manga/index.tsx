import ReadSection from "@/components/features/manga/ReadSection";
import RecommendedMangaSection from "@/components/features/manga/RecommendedMangaSection";
import CardSwiper from "@/components/shared/CardSwiper";
import ClientOnly from "@/components/shared/ClientOnly";
import ColumnSection from "@/components/shared/ColumnSection";
import GenresSelector from "@/components/shared/GenresSelector";
import Head from "@/components/shared/Head";
import HomeBanner from "@/components/shared/HomeBanner";
import NewestComments from "@/components/shared/NewestComments";
import Section from "@/components/shared/Section";
import ShouldWatch from "@/components/shared/ShouldWatch";
import { REVALIDATE_TIME } from "@/constants";
import supabase from "@/lib/supabase";
import { Manga } from "@/types";
import { GetStaticProps, NextPage } from "next";
import React from "react";

interface HomeProps {
  trendingManga: Manga[];
  randomManga: Manga;
  popularManga: Manga[];
  favouriteManga: Manga[];
  recentlyUpdatedManga: Manga[];
}

const Home: NextPage<HomeProps> = ({
  trendingManga,
  randomManga,
  recentlyUpdatedManga,
  favouriteManga,
  popularManga,
}) => {
  return (
    <React.Fragment>
      <Head />

      <ClientOnly>
        <div className="pb-8">
          <HomeBanner type="manga" data={trendingManga} />

          <div className="space-y-8">
            <ReadSection />
            <RecommendedMangaSection />

            <Section className="flex flex-col md:flex-row items-center md:space-between space-y-4 space-x-0 md:space-y-0 md:space-x-4">
              <ColumnSection
                title="Nổi bật nhất"
                type="manga"
                data={popularManga}
                viewMoreHref="/browse?sort=popularity&type=manga"
              />
              <ColumnSection
                title="Được yêu thích"
                type="manga"
                data={favouriteManga}
                viewMoreHref="/browse?sort=favourites&type=manga"
              />
            </Section>

            <NewestComments type="manga" />

            <Section title="Mới cập nhật">
              <CardSwiper type="manga" data={recentlyUpdatedManga} />
            </Section>

            <ShouldWatch type="manga" data={randomManga} />

            <Section title="Thể loại">
              <GenresSelector type="manga" />
            </Section>
          </div>
        </div>
      </ClientOnly>
    </React.Fragment>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data: trendingManga } = await supabase
    .from<Manga>("manga")
    .select("*")
    .order("trending", { ascending: false })
    .not("banner_image", "is", null)
    .limit(15);

  const { data: recentlyUpdatedManga } = await supabase
    .from<Manga>("manga")
    .select(
      "cover_image, genres, average_score, favourites, title, vietnamese_title, ani_id"
    )
    .order("chapters_updated_at", { ascending: false })
    .limit(15);

  const { data: randomManga } = await supabase
    .rpc<Manga>("manga_random")
    .limit(1)
    .not("banner_image", "is", null)
    .single();

  const { data: popularManga } = await supabase
    .from<Manga>("manga")
    .select(
      "ani_id, cover_image, genres, title, vietnamese_title, format, status"
    )
    .order("popularity", { ascending: false })
    .limit(5);

  const { data: favouriteManga } = await supabase
    .from<Manga>("manga")
    .select(
      "ani_id, cover_image, genres, title, vietnamese_title, format, status"
    )
    .order("favourites", { ascending: false })
    .limit(5);

  return {
    props: {
      trendingManga,
      recentlyUpdatedManga,
      randomManga,
      popularManga,
      favouriteManga,
    },

    revalidate: REVALIDATE_TIME,
  };
};

export default Home;

import HomeBanner from "@/components/shared/HomeBanner";
import CardSwiper from "@/components/shared/CardSwiper";
import ClientOnly from "@/components/shared/ClientOnly";
import Head from "@/components/shared/Head";
import TopList from "@/components/shared/TopList";
import Section from "@/components/shared/Section";
import { REVALIDATE_TIME } from "@/constants";
import supabase from "@/lib/supabase";
import { Manga } from "@/types";
import { GetStaticProps, NextPage } from "next";
import React from "react";
import ShouldWatch from "@/components/shared/ShouldWatch";
import GenresSelector from "@/components/shared/GenresSelector";
import ReadSection from "@/components/features/manga/ReadSection";
import RecommendedMangaSection from "@/components/features/manga/RecommendedMangaSection";
import NewestComments from "@/components/shared/NewestComments";

interface HomeProps {
  trendingManga: Manga[];
  topManga: Manga[];
  randomManga: Manga;
  recentlyUpdatedManga: Manga[];
}

const Home: NextPage<HomeProps> = ({
  trendingManga,
  topManga,
  randomManga,
  recentlyUpdatedManga,
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
            <NewestComments type="manga" />

            <Section title="Mới cập nhật">
              <CardSwiper type="manga" data={recentlyUpdatedManga} />
            </Section>

            <ShouldWatch type="manga" data={randomManga} />

            <Section title="Thể loại">
              <GenresSelector type="manga" />
            </Section>

            <Section title="Top manga">
              <TopList type="manga" data={topManga} />
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

  const { data: topManga } = await supabase
    .from<Manga>("manga")
    .select(
      "ani_id, cover_image, genres, average_score, favourites, title, vietnamese_title, format, status"
    )
    .order("average_score", { ascending: false })
    .limit(10);

  return {
    props: {
      trendingManga,
      recentlyUpdatedManga,
      randomManga,
      topManga,
    },

    revalidate: REVALIDATE_TIME,
  };
};

export default Home;

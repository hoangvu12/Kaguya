import ReadSection from "@/components/features/manga/ReadSection";
import RecommendedMangaSection from "@/components/features/manga/RecommendedMangaSection";
import CardSwiper from "@/components/shared/CardSwiper";
import ClientOnly from "@/components/shared/ClientOnly";
import ColumnSection from "@/components/shared/ColumnSection";
import GenreSwiper from "@/components/shared/GenreSwiper";
import Head from "@/components/shared/Head";
import HomeBanner from "@/components/shared/HomeBanner";
import NewestComments from "@/components/shared/NewestComments";
import Section from "@/components/shared/Section";
import ShouldWatch from "@/components/shared/ShouldWatch";
import { REVALIDATE_TIME } from "@/constants";
import useDevice from "@/hooks/useDevice";
import supabase from "@/lib/supabase";
import { Manga } from "@/types";
import classNames from "classnames";
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
  const { isDesktop } = useDevice();

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

            <div
              className={classNames(
                "flex gap-8",
                isDesktop ? "flex-row" : "flex-col"
              )}
            >
              {" "}
              <Section
                title="Đọc gì hôm nay?"
                className="w-full md:w-[80%] md:!pr-0"
              >
                <ShouldWatch type="manga" data={randomManga} />
              </Section>
              <Section title="Thể loại" className="w-full md:w-[20%] md:!pl-0">
                <GenreSwiper className="md:h-[500px]" />
              </Section>
            </div>
          </div>
        </div>
      </ClientOnly>
    </React.Fragment>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data: trendingManga } = await supabase
    .from<Manga>("kaguya_manga")
    .select("*")
    .order("trending", { ascending: false })
    .limit(15);

  const { data: recentlyUpdatedManga } = await supabase
    .from<Manga>("kaguya_manga")
    .select(
      "coverImage, genres, averageScore, favourites, title, vietnameseTitle, id"
    )
    .order("chapterUpdatedAt", { ascending: false })
    .limit(15);

  const { data: randomManga } = await supabase
    .rpc<Manga>("manga_random")
    .limit(1)
    .not("bannerImage", "is", null)
    .single();

  const { data: popularManga } = await supabase
    .from<Manga>("kaguya_manga")
    .select("id, coverImage, genres, title, vietnameseTitle, format, status")
    .order("popularity", { ascending: false })
    .limit(5);

  const { data: favouriteManga } = await supabase
    .from<Manga>("kaguya_manga")
    .select("id, coverImage, genres, title, vietnameseTitle, format, status")
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

import React, { useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { ThemeSettingsContextProvider } from "@/contexts/ThemeSettingsContext";
import { fetchRandomTheme, useAnimeTheme } from "@/hooks/useAnimeTheme";
import { ThemePlayerContextProvider } from "@/contexts/ThemePlayerContext";
import Head from "@/components/shared/Head";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

const ThemePlayer = dynamic(
  () => import("@/components/features/themes/ThemePlayer"),
  { ssr: false }
);

const blankVideo = [
  {
    file: "https://cdn.plyr.io/static/blank.mp4",
  },
];

interface ThemesPageProps {
  slug: string;
  type: string;
}

const ThemesPage = ({ slug, type }: ThemesPageProps) => {
  const router = useRouter();
  const { data, isLoading } = useAnimeTheme({ slug, type });

  const handleNewTheme = useCallback(async () => {
    const { slug, type } = await fetchRandomTheme();

    router.replace({
      pathname: router.pathname,
      query: {
        slug,
        type,
      },
    });
  }, [router]);

  const sources = useMemo(
    () => (isLoading || !data?.sources?.length ? blankVideo : data?.sources),
    [data?.sources, isLoading]
  );

  useEffect(() => {
    if (!data) return;

    router.replace(
      {
        pathname: router.pathname,
        query: {
          slug: data.slug,
          type: data.type,
        },
      },
      null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (slug && type) return;

    handleNewTheme();
  }, [handleNewTheme, slug, type]);

  return (
    <React.Fragment>
      <Head
        title={
          !data ? `Themes - Kaguya` : `${data.name} (${data.type}) - Kaguya`
        }
        description="Xem OP/ED của các Anime mà bạn yêu thích."
      />

      <ThemePlayerContextProvider
        value={{ theme: data, refresh: handleNewTheme, isLoading }}
      >
        <ThemeSettingsContextProvider>
          <ThemePlayer sources={sources} className="w-full h-screen" />
        </ThemeSettingsContextProvider>
      </ThemePlayerContextProvider>
    </React.Fragment>
  );
};

ThemesPage.getLayout = (children) => (
  <React.Fragment>{children}</React.Fragment>
);

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      slug: query.slug || null,
      type: query.type || null,
    },
  };
};

export default ThemesPage;

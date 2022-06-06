import React, { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { ThemeSettingsContextProvider } from "@/contexts/ThemeSettingsContext";
import { useAnimeTheme } from "@/hooks/useAnimeTheme";
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
  type: "OP" | "ED";
}

const ThemesPage = ({ slug, type }: ThemesPageProps) => {
  const router = useRouter();
  const { data, refetch, isLoading } = useAnimeTheme(slug, type);

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
      null,
      {
        shallow: true,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <React.Fragment>
      <Head
        title={
          !data ? `Themes - Kaguya` : `${data.name} (${data.type}) - Kaguya`
        }
      />

      <ThemePlayerContextProvider
        value={{ theme: data, refresh: refetch, isLoading }}
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
  const { slug, type } = query;

  return {
    props: {
      slug,
      type,
    },
  };
};

export default ThemesPage;

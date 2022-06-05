import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { ThemeSettingsContextProvider } from "@/contexts/ThemeSettingsContext";
import { useAnimeTheme } from "@/hooks/useAnimeTheme";
import { ThemePlayerContextProvider } from "@/contexts/ThemePlayerContext";
import Head from "@/components/shared/Head";

const ThemePlayer = dynamic(
  () => import("@/components/features/themes/ThemePlayer"),
  { ssr: false }
);

const blankVideo = [
  {
    file: "https://cdn.plyr.io/static/blank.mp4",
  },
];

const ThemesPage = () => {
  const { data, refetch, isLoading } = useAnimeTheme();

  const sources = useMemo(
    () => (isLoading ? blankVideo : data?.sources || []),
    [data?.sources, isLoading]
  );

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

export default ThemesPage;

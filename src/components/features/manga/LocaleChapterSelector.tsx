import locales from "@/locales.json";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import ChapterSelector, { ChapterSelectorProps } from "./ChapterSelector";

interface LocaleChapterSelectorProps extends ChapterSelectorProps {}

const LocaleChapterSelector: React.FC<LocaleChapterSelectorProps> = ({
  chapters,
  ...props
}) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const defaultTabIndex = useMemo(
    () => locales.findIndex(({ locale }) => locale === router.locale),
    [router.locale]
  );

  return (
    <React.Fragment>
      <Tabs
        defaultIndex={defaultTabIndex}
        selectedTabClassName="bg-white !text-black"
      >
        <TabList className="flex items-center justify-end gap-x-1">
          {locales.map(({ locale }, index) => {
            return (
              <Tab
                key={index}
                className={classNames(
                  "px-3 py-2 rounded-[6px] cursor-pointer hover:bg-white hover:text-black transition duration-300"
                )}
              >
                {locale.toUpperCase()}
              </Tab>
            );
          })}
        </TabList>

        <div className="mt-4">
          {locales.map(({ locale }, index) => {
            const localeChapters = chapters?.filter((chapter) =>
              chapter?.source?.locales.some(
                (sourceLocale) => sourceLocale === locale
              )
            );

            return (
              <TabPanel key={index}>
                {!localeChapters?.length ? (
                  <p className="text-center text-2xl">{t("no_chapters")}</p>
                ) : (
                  <ChapterSelector chapters={localeChapters} {...props} />
                )}
              </TabPanel>
            );
          })}
        </div>
      </Tabs>
    </React.Fragment>
  );
};

export default LocaleChapterSelector;

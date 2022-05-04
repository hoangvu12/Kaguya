import locales from "@/locales.json";
import { useRouter } from "next/router";
import nookies from "nookies";
import React, { useMemo } from "react";
import { MdOutlineLanguage } from "react-icons/md";
import Popup from "./Popup";

const LanguageSwitcher = () => {
  const router = useRouter();

  const handleChangeLanguage = (lang: string) => () => {
    if (router.locale === lang) return;

    const { pathname, asPath, query } = router;

    router.replace({ pathname, query }, asPath, {
      locale: lang,
      shallow: true,
    });

    nookies.set(null, "NEXT_LOCALE", lang, { path: "/" });
  };

  const currentLocale = useMemo(
    () => locales.find(({ locale }) => router.locale === locale),
    [router.locale]
  );

  return (
    <Popup
      type="click"
      placement="bottom-end"
      showArrow
      reference={
        <div className="lg:bg-background-900 rounded-3xl p-2 flex items-center gap-x-2">
          <MdOutlineLanguage className="w-6 h-6 hover:text-primary-300 transition duration-300" />

          <p className="hidden lg:block text-white text-base">
            {currentLocale.name}
          </p>
        </div>
      }
    >
      <ul className="space-y-1">
        {locales.map(({ locale, name }) => (
          <li
            className="cursor-pointer transition duration-300 hover:text-primary-300"
            onClick={handleChangeLanguage(locale)}
            key={locale}
            title={locale}
          >
            {name}
          </li>
        ))}
      </ul>
    </Popup>
  );
};

export default React.memo(LanguageSwitcher);

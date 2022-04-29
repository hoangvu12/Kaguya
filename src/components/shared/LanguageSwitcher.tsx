import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import nookies from "nookies";
import React, { useMemo } from "react";
import { MdOutlineLanguage } from "react-icons/md";
import Popup from "./Popup";

const locales = [
  {
    locale: "vi",
    name: "Tiếng Việt",
  },
  { locale: "en", name: "English" },
];

const LanguageSwitcher = () => {
  const router = useRouter();
  const { i18n, t } = useTranslation();

  const handleChangeLanguage = (lang: string) => () => {
    if (router.locale === lang) return;

    const { pathname, asPath, query } = router;

    router.replace({ pathname, query }, asPath, {
      locale: lang,
      shallow: true,
    });

    i18n.changeLanguage(lang);

    nookies.set(null, "NEXT_LOCALE", lang, { path: "/" });
  };

  const languages = useMemo(
    () => Object.keys(i18n.store.data),
    [i18n.store.data]
  );

  return (
    <Popup
      type="click"
      placement="bottom-end"
      reference={
        <MdOutlineLanguage className="w-6 h-6 hover:text-primary-300 transition duration-300" />
      }
    >
      <ul className="space-y-1">
        {languages.map((lang) => (
          <li
            className="cursor-pointer transition duration-300 hover:text-primary-300"
            onClick={handleChangeLanguage(lang)}
            key={lang}
            title={lang}
          >
            {t("language", { lng: lang })}
          </li>
        ))}
      </ul>
    </Popup>
  );
};

export default React.memo(LanguageSwitcher);

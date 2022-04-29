import { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const REQUIRED_NAMESPACES = ["common", "header"];

export const getTranslations = async <
  T extends GetServerSidePropsContext | GetStaticPropsContext
>(
  ctx: T
) => {
  const translations = await serverSideTranslations(
    ctx.locale,
    REQUIRED_NAMESPACES,
    nextI18nextConfig
  );

  return {
    props: {
      ...translations,
    },
  };
};

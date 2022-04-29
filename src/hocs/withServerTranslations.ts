import { REQUIRED_NAMESPACES } from "@/utils/translation";
import { GetServerSideProps, GetStaticProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const withServerTranslations = <T extends GetStaticProps | GetServerSideProps>(
  fn: T,
  namespaces?: string[]
) => {
  return async (ctx: any) => {
    const translations = await serverSideTranslations(
      ctx.locale,
      REQUIRED_NAMESPACES.concat(namespaces),
      nextI18nextConfig
    );

    // @ts-ignore
    const { props = {}, ...rest } = await fn(ctx);

    return {
      props: {
        ...props,
        ...translations,
      },

      ...rest,
    };
  };
};

export default withServerTranslations;

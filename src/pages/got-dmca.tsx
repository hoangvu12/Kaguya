import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Section from "@/components/shared/Section";
import { useTranslation } from "next-i18next";
import Link from "next/link";

function ErrorPage() {
  const { t } = useTranslation("got_dmca_page");

  return (
    <div className="relative w-full min-h-screen flex items-center">
      <Head title={`${t("error_title")} - Kaguya`} />

      <div className="fixed z-0 w-full h-full flex items-center justify-center">
        <h1 className="font-bold text-[30vw] text-gray-500">404</h1>

        <div className="absolute inset-0 bg-black/90 w-full h-full"></div>
      </div>

      <Section className="relative z-10 flex flex-col items-center w-full h-full text-center ">
        <p className="text-4xl font-semibold">{t("error_heading")}</p>

        <Link href="/">
          <a>
            <Button primary outline className="mt-8">
              <p className="text-lg">{t("error_goback")}</p>
            </Button>
          </a>
        </Link>
      </Section>
    </div>
  );
}

ErrorPage.getLayout = (page) => page;

export default ErrorPage;

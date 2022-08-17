import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import { REVALIDATE_TIME } from "@/constants";
import useSignIn from "@/hooks/useSignIn";
import quotes from "@/quotes.json";
import { randomElement } from "@/utils";
import { Provider } from "@supabase/gotrue-js";
import axios from "axios";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { FaDiscord, FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

interface Quote {
  anime: string;
  character: string;
  quote: string;
}

interface LoginPageProps {
  quotes: Quote[];
}

const isDev = process.env.NODE_ENV === "development";

const LoginPage: NextPage<LoginPageProps> = ({ quotes }) => {
  const randomQuote = useMemo(() => randomElement(quotes), [quotes]);
  const { t } = useTranslation("login");

  const { query } = useRouter();

  const { redirectedFrom = "/" } = query as { redirectedFrom: string };

  const signInMutation = useSignIn({
    redirectTo: isDev
      ? `http://localhost:3000${redirectedFrom}`
      : redirectedFrom,
  });

  const handleSignIn = (provider: Provider) => () => {
    signInMutation.mutate(provider);
  };

  return (
    <React.Fragment>
      <Head
        title={`${t("login_heading")} - Kaguya`}
        description={t("login_description")}
      />

      <div className="w-full h-screen grid grid-cols-1 md:grid-cols-5">
        <div
          className="hidden md:block relative col-span-2 after:absolute after:inset-0 after:bg-background/80 after:z-10"
          style={{
            backgroundImage: "url('/login-background.png')",
            backgroundPosition: "center center",
            backgroundSize: "cover",
          }}
        >
          <div className="relative flex flex-col justify-center items-center w-full h-full z-20">
            <div className="w-full px-8">
              <p className="text-4xl font-semibold text-white line-clamp-6">
                &quot;{randomQuote.quote}&quot;
              </p>
              <p className="text-right text-xl italic mt-4 font-semibold">
                {randomQuote.character}
              </p>
              <p className="text-right font-medium text-gray-300">
                {randomQuote.anime}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-3 bg-background flex items-center justify-center">
          <div className="w-full px-4 md:px-0 md:w-1/2">
            <h1 className="text-5xl font-bold mb-8">{t("login_heading")}</h1>

            <div className="space-y-4">
              <Button
                className="shadow-lg relative bg-white text-black font-bold flex items-center justify-center w-full hover:!bg-opacity-90"
                LeftIcon={FcGoogle}
                iconClassName="absolute left-6"
                onClick={handleSignIn("google")}
              >
                <p>{t("login_with_google")}</p>
              </Button>
              <Button
                className="shadow-lg relative bg-[#2D88FF] !hover:bg-white/20 text-white font-bold flex items-center justify-center w-full hover:!bg-opacity-90"
                LeftIcon={FaFacebookF}
                iconClassName="absolute left-6"
                onClick={handleSignIn("facebook")}
              >
                <p>{t("login_with_facebook")}</p>
              </Button>
              <Button
                className="shadow-lg relative bg-[#5865F2] !hover:bg-white/20 text-white font-bold flex items-center justify-center w-full hover:!bg-opacity-90"
                LeftIcon={FaDiscord}
                iconClassName="absolute left-6"
                onClick={handleSignIn("discord")}
              >
                <p>{t("login_with_discord")}</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

// @ts-ignore
LoginPage.getLayout = (page) => page;

export const getStaticProps: GetStaticProps = async () => {
  try {
    const { data } = await axios.get("https://animechan.vercel.app/api/quotes");

    return {
      props: {
        quotes: data,
      },
      revalidate: REVALIDATE_TIME,
    };
  } catch (err) {
    return {
      props: {
        quotes,
      },
    };
  }
};

export default LoginPage;

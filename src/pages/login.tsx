import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Image from "@/components/shared/Image";
import useSignIn from "@/hooks/useSignIn";
import supabase from "@/lib/supabase";
import quotes from "@/quotes.json";
import { randomElement } from "@/utils";
import { Provider } from "@supabase/gotrue-js";
import axios from "axios";
import { NextPage } from "next";
import React from "react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

interface Quote {
  anime: string;
  character: string;
  quote: string;
}

interface LoginPageProps {
  quotes: Quote[];
}

const LoginPage: NextPage<LoginPageProps> = ({ quotes }) => {
  const randomQuote = randomElement(quotes);
  const signInMutation = useSignIn({ redirectTo: "/" });

  const handleSignIn = (provider: Provider) => () => {
    signInMutation.mutate(provider);
  };

  return (
    <React.Fragment>
      <Head
        title="Đăng nhập - Kaguya"
        description="Đăng nhập vào Kaguya để xem anime và sử dụng nhiều tính năng hay."
      />

      <div className="w-full h-screen grid grid-cols-5">
        <div
          className="relative col-span-2 px-16 py-8 after:absolute after:inset-0 after:bg-background/80 after:z-10"
          style={{
            backgroundImage: "url('/login-background.png')",
            backgroundPosition: "center center",
            backgroundSize: "cover",
          }}
        >
          <div className="relative flex flex-col justify-center items-center w-full h-full z-20">
            <div className="absolute left-1/2 -translate-x-1/2 top-5">
              <Image src="/logo.png" alt="logo" width={100} height={100} />
            </div>

            <div className="w-full">
              <h1 className="text-4xl font-semibold text-white">
                "{randomQuote.quote}"
              </h1>
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
          <div className="w-1/2">
            <h1 className="text-5xl font-bold mb-8">Đăng nhập</h1>

            <Button
              className="shadow-lg relative bg-white text-black font-bold flex items-center justify-center w-full hover:!bg-opacity-90 mb-2"
              LeftIcon={FcGoogle}
              iconClassName="absolute left-6"
              onClick={handleSignIn("google")}
            >
              <p>Đăng nhập với Google</p>
            </Button>
            <Button
              className="shadow-lg relative bg-[#2D88FF] !hover:bg-white/20 text-white font-bold flex items-center justify-center w-full hover:!bg-opacity-90"
              LeftIcon={FaFacebookF}
              iconClassName="absolute left-6"
              onClick={handleSignIn("facebook")}
            >
              <p>Đăng nhập với Facebook</p>
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

// @ts-ignore
LoginPage.getLayout = (page) => page;

export const getStaticProps = async () => {
  try {
    const { data } = await axios.get("https://animechan.vercel.app/api/quotes");

    return {
      props: {
        quotes: data,
      },
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

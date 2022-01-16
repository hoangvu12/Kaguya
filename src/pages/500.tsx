import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Image from "@/components/shared/Image";
import { useRouter } from "next/router";
import React from "react";
import { DISCORD_URL, FACEBOOK_URL } from "@/constants";
import { AiFillFacebook } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import Link from "next/link";

const Error500Page = () => {
  const router = useRouter();

  return (
    <div className="text-center fixed inset-0 flex flex-col items-center justify-center">
      <Head title="Lỗi - Kaguya" />

      <p className="text-4xl font-semibold">Đã có lỗi xảy ra.</p>

      <p className="text-2xl mt-2">
        Vui lòng báo cáo lỗi tại Discord hoặc Facebook dưới đây.
      </p>

      <div className="flex items-center space-x-4 mt-8">
        <a href={FACEBOOK_URL} target="_blank" rel="noreferrer">
          <AiFillFacebook className="w-6 h-6 hover:text-primary-500 transition duration-300" />
        </a>
        <a href={DISCORD_URL} target="_blank" rel="noreferrer">
          <FaDiscord className="w-6 h-6 hover:text-primary-500 transition duration-300" />
        </a>
      </div>

      <Link href="/">
        <a>
          <Button primary outline className="mt-8">
            <p>Quay về chiều không gian cũ</p>
          </Button>
        </a>
      </Link>
    </div>
  );
};

Error500Page.getLayout = (page) => page;

export default Error500Page;

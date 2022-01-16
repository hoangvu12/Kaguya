import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Image from "@/components/shared/Image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Error404Page = () => {
  const router = useRouter();

  return (
    <div className="text-center fixed inset-0 flex flex-col items-center justify-center">
      <Head title="Không tìm thấy trang này - Kaguya" />

      <Image
        src="/404.png"
        alt="404"
        objectFit="contain"
        width={350}
        height={350}
      />

      <p className="text-4xl font-semibold">
        Bạn đã tìm thấy một chiều không gian mới.
      </p>

      <p className="text-2xl mt-2">
        Nhưng đáng tiếc thay, chiều không gian này không có thứ gì cả
      </p>

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

Error404Page.getLayout = (page) => page;

export default Error404Page;

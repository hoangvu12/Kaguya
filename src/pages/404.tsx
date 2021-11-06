import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Image from "@/components/shared/Image";
import { useRouter } from "next/router";
import React from "react";

const ErrorPage = () => {
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

      <Button primary outline className="mt-8" onClick={() => router.push("/")}>
        <p>Quay về chiều không gian cũ</p>
      </Button>
    </div>
  );
};

ErrorPage.getLayout = (page) => page;

export default ErrorPage;

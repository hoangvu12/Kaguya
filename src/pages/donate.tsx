import Head from "@/components/shared/Head";
import Image from "@/components/shared/Image";
import React from "react";

const ErrorPage = () => {
  return (
    <div className="w-full h-full pt-20 flex flex-col items-center justify-center">
      <Head title="Donate - Kaguya" />

      <Image
        src="/donate.png"
        alt="donate"
        objectFit="contain"
        width={350}
        height={350}
      />

      <p className="text-3xl font-semibold text-center">
        Website này được xây dựng với mục đích đưa cho người dùng một trải
        nghiệm tốt nhất.
      </p>

      <p className="text-2xl mt-2">
        Vì vậy, website này không hề có quảng cáo hay trả phí.
      </p>

      <p className="text-2xl mt-2">
        Nếu mọi người muốn ủng hộ web, hãy donate tới:
      </p>

      <p className="text-xl">0000119610632 NGUYEN HOANG NGUYEN VU MBBank</p>
    </div>
  );
};

export default ErrorPage;

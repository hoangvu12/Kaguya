import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Image from "@/components/shared/Image";
import Section from "@/components/shared/Section";
import Link from "next/link";

function Error() {
  return (
    <Section className="w-full h-screen flex items-center">
      <div className="flex flex-col items-center w-full text-center md:text-left md:items-start">
        <Head title={`Đã có lỗi xảy ra (404) - Kaguya`} />

        <div className="mb-4 text-gray-300">
          <span className="text-base">
            Chào mừng đến với{" "}
            <span className="text-red-300">chiều không gian 404</span>
          </span>
        </div>

        <p className="text-3xl font-semibold">
          Bạn đã tìm thấy một chiều không gian mới.
        </p>

        <p className="text-xl text-gray-200 mt-4">
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

      <div className="hidden md:block relative w-full h-full grow">
        <Image
          src="/error-background.png"
          alt="404"
          objectFit="contain"
          className="grow"
          layout="fill"
        />
      </div>
    </Section>
  );
}

Error.getLayout = (page) => page;

export default Error;

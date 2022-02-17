import TraceImageSearch from "@/components/features/trace/TraceImageSearch";
import TracePanel from "@/components/features/trace/TracePanel";
import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Image from "@/components/shared/Image";
import Loading from "@/components/shared/Loading";
import useTraceImage, { TraceImageResponse } from "@/hooks/useTraceImage";
import React, { useCallback, useState } from "react";
import { CgArrowLongRight } from "react-icons/cg";
import { MdOutlineRestartAlt } from "react-icons/md";
import { ImageType } from "react-images-uploading";

const TracePage = () => {
  const [traceResult, setTraceResult] = useState<TraceImageResponse>(null);
  const [image, setImage] = useState<ImageType>(null);

  const { mutateAsync, isLoading } = useTraceImage();

  const handleOnSearch = useCallback(
    async (image: ImageType) => {
      setImage(image);

      const result = await mutateAsync(image);

      setTraceResult(result);
    },
    [mutateAsync]
  );

  const handleReset = useCallback(() => {
    setTraceResult(null);
    setImage(null);
  }, []);

  return (
    <React.Fragment>
      <Head title="Tìm kiếm Anime qua hình ảnh - Kaguya" />

      <div className="pt-20 px-4 md:px-12 space-y-16 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-1">
            Công cụ tìm kiếm Anime bằng hình ảnh.
          </h1>

          <h3 className="text-lg mb-2">
            Nó cho bạn biết anime, tập và khoảnh khắc mà hình ảnh đó xuất hiện!
          </h3>

          <p className="italic text-lg mb-1">
            Công cụ sử dụng công nghệ tìm kiếm của{" "}
            <a
              className="text-primary-300 hover:underline"
              href="https://github.com/soruly/trace.moe"
            >
              trace.moe
            </a>
          </p>

          <p className="italic">
            Lưu ý: Kết quả tìm kiếm không hoàn toàn chính xác 100%.
          </p>
          <p className="italic">
            Lưu ý: Chỉ hoạt động với cảnh ở trong phim. Không hoạt động với art
            hay những ảnh không có trong phim.
          </p>
        </div>

        <div className="w-full hidden md:flex items-center justify-center gap-4">
          <div className="border border-white/60 relative h-64 w-full">
            <Image
              src="https://i.ibb.co/rGRC9vw/www-kaguya-live-trace.png"
              alt="example image"
              objectFit="cover"
              layout="fill"
            />
          </div>

          <CgArrowLongRight className="shrink-0 w-10 h-10" />

          <div className="border border-white/60 relative h-64 w-full">
            <Image
              src="https://i.ibb.co/cg7TwWR/www-kaguya-live-trace-1.png"
              alt="example image"
              objectFit="cover"
              layout="fill"
            />
          </div>
        </div>

        {traceResult ? (
          <React.Fragment>
            <Button
              primary
              onClick={handleReset}
              LeftIcon={MdOutlineRestartAlt}
            >
              <p>Thử ảnh khác</p>
            </Button>

            <TracePanel data={traceResult} image={image} />
          </React.Fragment>
        ) : isLoading ? (
          <div className="relative w-full md:w-1/3 flex justify-center items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.dataURL}
              alt="searched image"
              className="w-full object-fit blur-[2px] transition duration-300"
            />

            <div className="absolute inset-0 bg-black/30"></div>

            <Loading />
          </div>
        ) : (
          <TraceImageSearch onSearch={handleOnSearch} />
        )}
      </div>
    </React.Fragment>
  );
};

export default TracePage;

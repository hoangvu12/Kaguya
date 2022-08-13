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
import { useTranslation } from "react-i18next";
import Section from "@/components/shared/Section";

const TracePage = () => {
  const [traceResult, setTraceResult] = useState<TraceImageResponse>(null);
  const [image, setImage] = useState<ImageType>(null);

  const { mutateAsync, isLoading } = useTraceImage();
  const [t] = useTranslation("trace");

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
      <Head
        title={`${t("tab_title")} - Kaguya`}
        description="Tìm kiếm Anime, số tập mà khoảnh khắc trong ảnh đó xuất hiện."
      />

      <Section className="pt-20 space-y-16 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-1">{t("heading")}</h1>

          <h3 className="text-lg mb-2">{t("description")}</h3>

          <p className="italic text-lg mb-1">
            {t("made_by")}{" "}
            <a
              className="text-primary-300 hover:underline"
              href="https://github.com/soruly/trace.moe"
            >
              trace.moe
            </a>
          </p>

          <p className="italic">{t("note")}</p>
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
              <p>{t("try_again")}</p>
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
      </Section>
    </React.Fragment>
  );
};

export default TracePage;

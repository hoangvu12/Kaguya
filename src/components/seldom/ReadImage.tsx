import { useReadSettings } from "@/contexts/ReadSettingsContext";
import classNames from "classnames";
import React from "react";

const ReadImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
  className,
  ...props
}) => {
  const { fitMode } = useReadSettings();

  // I have to use img instead of Next/Image because I want to image calculate the height itself
  return (
    // eslint-disable-next-line
    <img
      className={classNames(
        fitMode === "auto" && "w-auto h-auto",
        fitMode === "width" && "w-full h-auto",
        fitMode === "height" && "w-auto h-screen",
        className
      )}
      alt="Đọc truyện tại Kaguya"
      src={`/api/proxy?url=${encodeURIComponent(src)}`}
      {...props}
    />
  );
};

export default React.memo(ReadImage);

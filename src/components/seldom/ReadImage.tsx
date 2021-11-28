import { ImageProps } from "next/image";
import React, { useState } from "react";
import Image from "../shared/Image";

const ReadImage: React.FC<ImageProps> = (props) => {
  const [aspectRatio, setAspectRatio] = useState(0);

  return (
    <div
      style={{ paddingBottom: aspectRatio * 100 + "%", position: "relative" }}
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        {...props}
        onLoadingComplete={({ naturalHeight, naturalWidth }) => {
          setAspectRatio(naturalHeight / naturalWidth);
        }}
      />
    </div>
  );
};

export default ReadImage;

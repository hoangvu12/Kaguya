import React from "react";

const ReadImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (
  props
) => {
  // I have to use img instead of Next/Image because I want to imagg calculate the height itself
  return (
    // eslint-disable-next-line
    <img {...props} />
  );
};

export default React.memo(ReadImage);

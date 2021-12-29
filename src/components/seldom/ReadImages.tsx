import React from "react";
import ReadImage from "./ReadImage";

interface ReadImagesProps {
  images: string[];
}

const ReadImages: React.FC<ReadImagesProps> = ({ images }) => {
  return (
    <div className="w-full flex flex-col items-center">
      {images.map((image) => (
        <ReadImage
          src={`/api/proxy?url=${image}`}
          alt="Đọc truyện tại Kaguya"
          key={image}
          className="max-w-full w-auto h-auto"
        />
      ))}
    </div>
  );
};

export default React.memo(ReadImages);

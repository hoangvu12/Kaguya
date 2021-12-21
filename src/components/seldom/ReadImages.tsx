import React from "react";
import ReadImage from "./ReadImage";

interface ReadImagesProps {
  images: string[];
}

const ReadImages: React.FC<ReadImagesProps> = ({ images }) => {
  return (
    <div className="w-full read-images">
      {images.map((image) => (
        <ReadImage
          src={`/api/proxy?url=${image}`}
          alt="Đọc truyện tại Kaguya"
          key={image}
          className="w-full h-auto"
          layout="fill"
        />
      ))}
    </div>
  );
};

export default React.memo(ReadImages);

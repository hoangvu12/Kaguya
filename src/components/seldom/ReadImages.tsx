import React, { useEffect } from "react";

// @ts-ignore
import imagesLoaded from "imagesloaded";
import Image from "../shared/Image";
import ReadImage from "./ReadImage";

interface ReadImagesProps {
  images: string[];
  onImagesLoaded?: () => void;
}

const ReadImages: React.FC<ReadImagesProps> = ({ images, onImagesLoaded }) => {
  useEffect(() => {
    imagesLoaded(".read-images", onImagesLoaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

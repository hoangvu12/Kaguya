import React, { useEffect } from "react";

// @ts-ignore
import imagesLoaded from "imagesloaded";

interface ReadImageProps {
  images: string[];
  onImagesLoaded?: () => void;
}

const ReadImage: React.FC<ReadImageProps> = ({ images, onImagesLoaded }) => {
  useEffect(() => {
    imagesLoaded(".read-images", onImagesLoaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full read-images">
      {images.map((image) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/api/proxy?url=${image}`}
          alt="Đọc truyện tại Kaguya"
          key={image}
          className="w-full h-auto"
        />
      ))}
    </div>
  );
};

export default React.memo(ReadImage);

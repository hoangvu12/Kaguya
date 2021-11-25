import React from "react";

interface ReadImageProps {
  images: string[];
}

const ReadImage: React.FC<ReadImageProps> = ({ images }) => {
  return (
    <div className="w-full">
      {images.map((image) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/api/proxy?url=${image}`}
          alt="Đọc truyện tại Kaguya"
          key={image}
          className="w-full"
        />
      ))}
    </div>
  );
};

export default React.memo(ReadImage);

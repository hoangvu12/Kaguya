import React, { useState } from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { motion } from "framer-motion";

const variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
  },
};

interface ImageProps extends NextImageProps {
  containerClassName?: string;
}

const Image: React.FC<ImageProps> = (props) => {
  const { containerClassName } = props;

  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoaded(true);
  };

  return (
    <motion.div
      initial="hidden"
      variants={variants}
      animate={isLoaded ? "visible" : "hidden"}
      className={containerClassName}
    >
      <NextImage onLoadingComplete={handleLoadingComplete} {...props} />
    </motion.div>
  );
};

export default Image;

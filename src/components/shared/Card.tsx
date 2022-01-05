import DotList from "@/components/shared/DotList";
import Image from "@/components/shared/Image";
import TextIcon from "@/components/shared/TextIcon";
import useDevice from "@/hooks/useDevice";
import { Anime, DynamicData, Manga } from "@/types";
import { isColorVisible, numberWithCommas } from "@/utils";
import { convert } from "@/utils/data";
import classNames from "classnames";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";

interface AnimeCardProps {
  className?: string;
  containerEndSlot?: React.ReactNode;
  imageEndSlot?: React.ReactNode;
}

const imageVariants: Variants = {
  animate: {
    scale: 0.6,
    y: -40,
    transition: { delay: 0.3 },
  },
  exit: { scale: 1 },
};
const infoVariants: Variants = {
  animate: { y: 0, opacity: 1, transition: { delay: 0.3 } },
  exit: { y: 20, opacity: 0, transition: { duration: 0.2 } },
};

const containerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  exit: {},
};

const slotVariants: Variants = {
  animate: {
    opacity: 0,
  },
  exit: { opacity: 1 },
};

const Card: React.FC<AnimeCardProps & DynamicData<Anime, Manga>> = ({
  data,
  className,
  type = "anime",
  containerEndSlot,
  imageEndSlot,
}) => {
  const { isDesktop } = useDevice();

  const primaryColor =
    data.cover_image?.color && isColorVisible(data.cover_image.color, "#3a3939")
      ? data.cover_image.color
      : "white";

  const redirectUrl =
    type === "anime"
      ? `/anime/details/${data.ani_id}`
      : `/manga/details/${data.ani_id}`;

  const title =
    typeof data.title === "string" ? data.title : data.title.user_preferred;

  return (
    <Link href={redirectUrl}>
      <a>
        <motion.div
          variants={containerVariants}
          whileHover={isDesktop ? "animate" : ""}
          animate="exit"
          initial="exit"
        >
          <div
            className={classNames(
              "relative cursor-pointer aspect-w-9 aspect-h-16 bg-background-900",
              className
            )}
          >
            <motion.div className="w-full h-full" variants={imageVariants}>
              <Image
                src={data.cover_image.extra_large}
                layout="fill"
                objectFit="cover"
                className="rounded-sm"
                alt={data.vietnamese_title || title}
              />

              {imageEndSlot}
            </motion.div>

            <motion.div className="absolute bottom-0 flex flex-col items-center justify-end px-2 py-4 text-center">
              <motion.div variants={infoVariants} className="mt-2 !mb-1">
                <DotList>
                  {data.genres.slice(0, 2).map((genre) => (
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color: primaryColor,
                      }}
                      key={genre}
                    >
                      {convert(genre, "genre")}
                    </p>
                  ))}
                </DotList>
              </motion.div>

              <motion.div
                variants={infoVariants}
                className="flex items-center space-x-2"
              >
                {data.average_score && (
                  <TextIcon
                    LeftIcon={MdTagFaces}
                    iconClassName="text-green-300"
                  >
                    <p>{data.average_score}%</p>
                  </TextIcon>
                )}

                <TextIcon LeftIcon={AiFillHeart} iconClassName="text-red-400">
                  <p>{numberWithCommas(data.favourites)}</p>
                </TextIcon>
              </motion.div>
            </motion.div>
          </div>

          <motion.div transition={{ duration: 0.1 }} variants={slotVariants}>
            {containerEndSlot}
          </motion.div>

          <p
            className="mt-2 text-base font-semibold line-clamp-2"
            style={{ color: primaryColor }}
          >
            {data.vietnamese_title || title}
          </p>
        </motion.div>
      </a>
    </Link>
  );
};

export default Card;

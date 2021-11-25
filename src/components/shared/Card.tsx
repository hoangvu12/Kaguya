import DotList from "@/components/shared/DotList";
import Image from "@/components/shared/Image";
import TextIcon from "@/components/shared/TextIcon";
import useDevice from "@/hooks/useDevice";
import { Anime, Manga } from "@/types";
import { isColorVisible, numberWithCommas } from "@/utils";
import { convert } from "@/utils/data";
import classNames from "classnames";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";

interface AnimeCardProps {
  data: Anime | Manga;
  className?: string;
  type?: string;
}

const imageVariants: Variants = {
  animate: {
    scale: 0.5,
    y: -60,
  },
  exit: { scale: 1 },
};
const infoVariants: Variants = {
  animate: { y: 0, opacity: 1 },
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

const Card: React.FC<AnimeCardProps> = ({
  data,
  className,
  type = "anime",
}) => {
  const { isDesktop } = useDevice();

  const primaryColor =
    data.cover_image.color && isColorVisible(data.cover_image.color, "#3a3939")
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
                alt={`${title} card`}
              />
            </motion.div>

            <motion.div className="px-2 py-4 flex flex-col justify-end items-center text-center absolute bottom-0">
              <motion.p
                variants={infoVariants}
                className="text-base font-semibold line-clamp-2"
                style={{ color: primaryColor }}
              >
                {title}
              </motion.p>

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

          {!isDesktop && (
            <p
              className="mt-2 text-lg font-semibold line-clamp-2"
              style={{ color: primaryColor }}
            >
              {title}
            </p>
          )}
        </motion.div>
      </a>
    </Link>
  );
};

export default Card;

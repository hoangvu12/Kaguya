import DotList from "@/components/shared/DotList";
import Image from "@/components/shared/Image";
import TextIcon from "@/components/shared/TextIcon";
import useDevice from "@/hooks/useDevice";
import { Media } from "@/types/anilist";
import {
  createMediaDetailsUrl,
  isColorVisible,
  numberWithCommas,
} from "@/utils";
import { convert, getTitle } from "@/utils/data";
import classNames from "classnames";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";
import Description from "./Description";

interface AnimeCardProps {
  data: Media;
  className?: string;
  containerEndSlot?: React.ReactNode;
  imageEndSlot?: React.ReactNode;
  redirectUrl?: string;
  isExpanded?: boolean;
}

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

const Card: React.FC<AnimeCardProps> = (props) => {
  const {
    data,
    className,
    containerEndSlot,
    redirectUrl = createMediaDetailsUrl(data),
    isExpanded,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });

  const { isDesktop } = useDevice();

  const router = useRouter();

  const primaryColor = useMemo(
    () =>
      data.coverImage?.color && isColorVisible(data.coverImage.color, "#3a3939")
        ? data.coverImage.color
        : "white",
    [data]
  );
  const title = useMemo(
    () => getTitle(data, router.locale),
    [data, router?.locale]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const { width } = containerRef.current.getBoundingClientRect();

    setCardSize({ width, height: width * (3 / 2) });
  }, []);

  return (
    <Link href={redirectUrl}>
      <a>
        <motion.div
          ref={containerRef}
          variants={containerVariants}
          whileHover={isDesktop ? "animate" : ""}
          animate="exit"
          initial="exit"
        >
          <motion.div
            className={classNames(
              "transition duration-300 w-full relative cursor-pointer bg-background-900",
              className
            )}
            style={{ height: cardSize.height }}
            initial={false}
          >
            <AnimatePresence>
              {!isExpanded ? (
                <motion.div
                  key={data.coverImage?.extraLarge}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="absolute h-full w-full"
                >
                  <Image
                    src={data.coverImage?.extraLarge}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-sm"
                    alt={title}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={data.bannerImage || data.coverImage?.extraLarge}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="absolute h-full w-full"
                >
                  <Image
                    src={data.bannerImage || data.coverImage?.extraLarge}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-sm"
                    alt={title}
                  />

                  <div className="absolute inset-0 bg-black/60"></div>

                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <p
                      className="text-2xl mb-3 font-semibold line-clamp-2"
                      style={{ color: primaryColor }}
                    >
                      {title}
                    </p>

                    <Description
                      description={data.description}
                      className="text-gray-300 hover:text-gray-100 transition duration-300 line-clamp-5 mb-2"
                    />

                    <DotList className="mb-2">
                      {data.genres?.map((genre) => (
                        <span
                          className="text-sm font-semibold"
                          style={{
                            color: primaryColor,
                          }}
                          key={genre}
                        >
                          {convert(genre, "genre", { locale: router.locale })}
                        </span>
                      ))}
                    </DotList>

                    <motion.div className="relative z-50 flex items-center space-x-2">
                      {data.averageScore && (
                        <TextIcon
                          LeftIcon={MdTagFaces}
                          iconClassName="text-green-300"
                        >
                          <p>{data.averageScore}%</p>
                        </TextIcon>
                      )}

                      <TextIcon
                        LeftIcon={AiFillHeart}
                        iconClassName="text-red-400"
                      >
                        <p>{numberWithCommas(data.favourites)}</p>
                      </TextIcon>
                    </motion.div>

                    <motion.div
                      className="mt-4"
                      transition={{ duration: 0.1 }}
                      variants={slotVariants}
                    >
                      {containerEndSlot}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <p
            className="mt-2 text-base font-semibold line-clamp-2"
            style={{ color: primaryColor }}
          >
            {title}
          </p>
        </motion.div>
      </a>
    </Link>
  );
};

export default React.memo(Card) as typeof Card;

import ArrowSwiper, { SwiperSlide } from "@/components/shared/ArrowSwiper";
import CircleButton from "@/components/shared/CircleButton";
import { Manga } from "@/types";
import { groupBy } from "@/utils";
import { sortMediaUnit } from "@/utils/data";
import classNames from "classnames";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

interface ChapterSelectorProps {
  manga: Manga;
}

const ChapterSelector: React.FC<ChapterSelectorProps> = ({ manga }) => {
  const [isChapterExpanded, setIsChapterExpanded] = useState(false);
  const chapters = useMemo(
    () =>
      sortMediaUnit(
        manga.sourceConnections.flatMap((connection) => connection.chapters)
      ),
    [manga]
  );
  const [activeSource, setActiveSource] = useState(chapters[0].source.name);

  const sourceChapters = useMemo(
    () =>
      chapters
        .filter((chapter) => chapter.source.name === activeSource)
        .reverse(),
    [activeSource, chapters]
  );

  const sources = useMemo(
    () => groupBy(chapters, (data) => data.source.name),
    [chapters]
  );

  useEffect(() => {
    const sourceKeys = Object.keys(sources);

    if (!sourceKeys?.length) return;

    if (!sourceKeys.includes(activeSource)) {
      setActiveSource(sourceKeys[0]);
    }
  }, [activeSource, sources]);

  return (
    <React.Fragment>
      <ArrowSwiper isOverflowHidden={false} className="w-11/12 mx-auto mb-8">
        {Object.keys(sources).map((source, i) => {
          return (
            <SwiperSlide onClick={() => setActiveSource(source)} key={i}>
              <div
                className={classNames(
                  "text-gray-300 cursor-pointer mx-auto rounded-[18px] px-2 py-1 w-[max-content] duration-300 transition",
                  activeSource === source
                    ? "bg-white text-black"
                    : "hover:text-white"
                )}
              >
                {source}
              </div>
            </SwiperSlide>
          );
        })}
      </ArrowSwiper>

      <motion.div
        className="space-y-2 overflow-hidden"
        variants={{
          animate: {
            height: "100%",
          },

          initial: {
            height: chapters.length <= 7 ? "100%" : 300,
          },
        }}
        transition={{ ease: "linear" }}
        animate={isChapterExpanded ? "animate" : "initial"}
      >
        {sourceChapters.map((chapter) => (
          <Link
            href={`/manga/read/${manga.id}/${chapter.sourceId}/${chapter.sourceChapterId}`}
            key={chapter.sourceChapterId}
          >
            <a className="block">
              <p className="line-clamp-1 bg-background-900 p-2 text-sm font-semibold hover:bg-white/20 duration-300 transition">
                {chapter.name}
              </p>
            </a>
          </Link>
        ))}
      </motion.div>

      {chapters.length > 7 && (
        <CircleButton
          onClick={() => setIsChapterExpanded(!isChapterExpanded)}
          outline
          className="absolute top-full mt-4 left-1/2 -translate-x-1/2"
          LeftIcon={isChapterExpanded ? BsChevronUp : BsChevronDown}
        />
      )}
    </React.Fragment>
  );
};

export default ChapterSelector;

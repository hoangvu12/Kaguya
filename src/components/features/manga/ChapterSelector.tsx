import ArrowSwiper, { SwiperSlide } from "@/components/shared/ArrowSwiper";
import CircleButton from "@/components/shared/CircleButton";
import Select from "@/components/shared/Select";
import { Chapter } from "@/types";
import { groupBy, sortObjectByValue } from "@/utils";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import Link from "@/components/shared/Link";
import React, { useEffect, useMemo, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

export interface ChapterSelectorProps {
  chapters: Chapter[];
  mediaId: number;
}

const sourcesToOptions = (sources: string[]) =>
  sources.map((source) => ({ value: source, label: source }));

const ChapterSelector: React.FC<ChapterSelectorProps> = ({
  chapters,
  mediaId,
}) => {
  const [isChapterExpanded, setIsChapterExpanded] = useState(false);

  const [activeSource, setActiveSource] = useState(chapters[0].source.name);

  const sourceChapters = useMemo(
    () =>
      chapters
        .filter((chapter) => chapter.source.name === activeSource)
        .reverse()
        .slice(0, isChapterExpanded ? undefined : 10),
    [activeSource, chapters, isChapterExpanded]
  );

  const sources = useMemo(
    () => groupBy(chapters, (data) => data.source.name),
    [chapters]
  );

  const verifiedSources = useMemo(() => {
    const verifiedChapters = chapters.filter(
      (chapter) => chapter.source.isCustomSource
    );

    const sources = groupBy(verifiedChapters, (chapter) => chapter.source.name);

    const sortedSources = sortObjectByValue(
      sources,
      (a, b) => b.length - a.length
    );

    return sortedSources;
  }, [chapters]);

  const nonVerifiedSources = useMemo(() => {
    const nonVerifiedChapters = chapters.filter(
      (chapter) => !chapter.source.isCustomSource
    );

    const sources = groupBy(
      nonVerifiedChapters,
      (chapter) => chapter.source.name
    );

    const sortedSources = sortObjectByValue(
      sources,
      (a, b) => b.length - a.length
    );

    return sortedSources;
  }, [chapters]);

  useEffect(() => {
    const sourceKeys = Object.keys(sources);

    if (!sourceKeys?.length) return;

    if (!sourceKeys.includes(activeSource)) {
      setActiveSource(sourceKeys[0]);
    }
  }, [activeSource, sources]);

  return (
    <React.Fragment>
      <div className="flex justify-end w-full mx-auto mb-8">
        <div className="flex items-center gap-2">
          <label htmlFor="source-selector" className="font-medium">
            Sources:{" "}
          </label>

          <Select
            id="source-selector"
            options={[
              {
                label: "Verified",
                options: sourcesToOptions(Object.keys(verifiedSources)),
              },
              {
                label: "Not verified",
                options: sourcesToOptions(Object.keys(nonVerifiedSources)),
              },
            ]}
            onChange={({ value }) => {
              setActiveSource(value);
            }}
            defaultValue={{ value: activeSource, label: activeSource }}
            isClearable={false}
            isSearchable={false}
          />
        </div>
      </div>

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
            href={`/manga/read/${mediaId}/${chapter.sourceId}/${chapter.sourceChapterId}`}
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

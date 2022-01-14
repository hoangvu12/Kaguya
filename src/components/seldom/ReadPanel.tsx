import Button from "@/components/shared/Button";
import ButtonTooltip from "@/components/shared/ButtonTooltip";
import CircleButton from "@/components/shared/CircleButton";
import Input from "@/components/shared/Input";
import Kbd from "@/components/shared/Kbd";
import { useReadInfo } from "@/contexts/ReadContext";
import {
  directions,
  fitModes,
  useReadSettings,
} from "@/contexts/ReadSettingsContext";
import useDevice from "@/hooks/useDevice";
import { getTitle } from "@/utils/data";
import classNames from "classnames";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import {
  AiOutlineSearch,
  AiOutlineZoomIn,
  AiOutlineZoomOut,
} from "react-icons/ai";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";
import {
  CgArrowDown,
  CgArrowLeft,
  CgArrowRight,
  CgArrowsShrinkH,
  CgArrowsShrinkV,
} from "react-icons/cg";
import { HiOutlineArrowsExpand } from "react-icons/hi";

const noop = () => {};

const sidebarVariants: Variants = {
  initial: {
    width: 0,
    opacity: 0,
  },
  animate: { width: "30%", opacity: 1 },
};

const mobileSidebarVarants: Variants = {
  initial: {
    y: "-100%",
  },
  animate: { y: 0 },
};

const transition = [0.33, 1, 0.68, 1];

interface ReadPanelProps {
  children({ isSidebarOpen }: { isSidebarOpen: boolean }): React.ReactNode;
}

const ReadPanel: React.FC<ReadPanelProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filterText, setFilterText] = useState("");
  const router = useRouter();
  const { isMobile } = useDevice();
  const { zoom, fitMode, direction, setSetting } = useReadSettings();
  const { manga, setChapterIndex, chapters, chapterIndex, currentChapter } =
    useReadInfo();
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredChapters = useMemo(() => {
    return chapters
      .map((chapter, index) => ({ ...chapter, chapter_index: index }))
      .filter((chapter) => chapter.name.includes(filterText));
  }, [chapters, filterText]);

  const handleSidebarState = (isOpen: boolean) => () =>
    setIsSidebarOpen(isOpen);

  const handleMobileClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();

    const target = e.target as HTMLElement;

    const button = target.closest("button");

    if (button?.nodeName === "BUTTON") return;

    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleZoomLevel = (level: number) => () => {
    if (level >= 1) level = 1;
    if (level <= 0.1) level = 0.1;

    setSetting("zoom", level);
  };

  const handleChapterChange = (index: number) => () => setChapterIndex(index);

  const title = useMemo(() => getTitle(manga), [manga]);

  // Scroll container to top when change chapter
  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.scrollTo({ top: 0 });
  }, [chapterIndex]);

  return (
    <div className="flex w-full h-screen overflow-y-hidden">
      <motion.div
        variants={isMobile ? mobileSidebarVarants : sidebarVariants}
        animate={isSidebarOpen ? "animate" : "initial"}
        initial="initial"
        className={classNames(
          "bg-background-800",
          isMobile && "fixed top-0 w-full min-h-[content] z-50"
        )}
        transition={{ ease: transition, duration: 0.6 }}
      >
        <div className="flex flex-col w-full h-full p-4 space-y-2">
          {/* Leave | Open/Close */}
          <div className="flex w-full items-center justify-between">
            <CircleButton
              LeftIcon={BsArrowLeft}
              iconClassName="w-7 h-7"
              secondary
              onClick={router.back}
            />

            <p className="text-center text-lg font-semibold line-clamp-1">
              {title}
            </p>

            <BrowserView>
              <CircleButton
                LeftIcon={BiChevronLeft}
                iconClassName="w-8 h-8"
                secondary
                onClick={handleSidebarState(false)}
              />
            </BrowserView>
          </div>

          {/* Mobile chapter selector */}
          <div className="flex items-center justify-center md:justify-between space-x-2 md:space-x-0">
            <ButtonTooltip
              tooltip={
                <p>
                  Chapter trước <Kbd className="ml-2">[</Kbd>
                </p>
              }
              LeftIcon={BiChevronLeft}
              iconClassName="w-8 h-8"
              secondary
              disabled={chapterIndex === 0}
              onClick={handleChapterChange(chapterIndex - 1)}
              shortcutKey="["
            />

            <MobileView className="flex-grow">
              <select
                value={chapterIndex.toString()}
                onChange={(e) => {
                  const index = e.target.value;

                  setChapterIndex(Number(index));
                }}
                className="rounded-md py-1 px-2 appearance-none w-full bg-background-700"
              >
                {chapters.map((chapter, index) => (
                  <option key={chapter.id} value={index}>
                    {chapter.name}
                  </option>
                ))}
              </select>
            </MobileView>

            <BrowserView>
              <p>{currentChapter.name}</p>
            </BrowserView>

            <ButtonTooltip
              tooltip={
                <p>
                  Chapter tiếp <Kbd className="ml-2">]</Kbd>
                </p>
              }
              LeftIcon={BiChevronRight}
              iconClassName="w-8 h-8"
              secondary
              disabled={chapterIndex === chapters.length - 1}
              onClick={handleChapterChange(chapterIndex + 1)}
              shortcutKey="]"
            />
          </div>

          {/* Options */}
          <div className="flex items-center justify-center space-x-2">
            <ButtonTooltip
              tooltip={
                <p>
                  Chế độ ảnh <Kbd className="ml-2">F</Kbd>
                </p>
              }
              LeftIcon={
                fitMode === "width"
                  ? CgArrowsShrinkH
                  : fitMode === "height"
                  ? CgArrowsShrinkV
                  : HiOutlineArrowsExpand
              }
              onClick={() => {
                const index = fitModes.indexOf(fitMode);

                const nextFitMode = fitModes[(index + 1) % fitModes.length];

                setSetting("fitMode", nextFitMode);
              }}
              shortcutKey="F"
            />

            <ButtonTooltip
              tooltip={
                <p>
                  Hướng đọc <Kbd className="ml-2">D</Kbd>
                </p>
              }
              LeftIcon={
                direction === "vertical"
                  ? CgArrowDown
                  : direction === "ltr"
                  ? CgArrowRight
                  : CgArrowLeft
              }
              onClick={() => {
                const index = directions.indexOf(direction);

                const nextDirection =
                  directions[(index + 1) % directions.length];

                setSetting("direction", nextDirection);
              }}
              shortcutKey="D"
            />
          </div>

          {/* Desktop chapter selector */}
          <BrowserView className="h-full space-y-2 overflow-y-hidden">
            <Input
              LeftIcon={AiOutlineSearch}
              className="w-full h-6 !bg-background-700"
              containerClassName="!bg-background-700"
              containerInputClassName="!bg-background-700"
              placeholder="Nhập chapter muốn tìm"
              onChange={(e) =>
                setFilterText((e.target as HTMLInputElement).value)
              }
            />

            <ul className="h-full space-y-2 bg-background-900 p-2 overflow-y-auto">
              {filteredChapters.map((chapter) => (
                <li
                  className="relative p-2 cursor-pointer hover:bg-white/20 transition duration-300"
                  key={chapter.chapter_id}
                  onClick={handleChapterChange(chapter.chapter_index)}
                >
                  {chapter.name}

                  {chapter.chapter_index === chapterIndex && (
                    <p className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-500 rounded-md">
                      Đang đọc
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </BrowserView>
        </div>
      </motion.div>

      <motion.div
        onClick={isMobile ? handleMobileClick : noop}
        ref={containerRef}
        className="content-container relative w-full flex flex-col items-center justify-center bg-background-900 overflow-y-auto"
      >
        <BrowserView>
          {!isSidebarOpen && (
            <motion.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              className="bg-background-800 fixed left-4 top-4 rounded-full"
            >
              <CircleButton
                LeftIcon={BiChevronRight}
                iconClassName="w-8 h-8"
                secondary
                onClick={handleSidebarState(true)}
              />
            </motion.div>
          )}

          {fitMode !== "height" && (
            <motion.div
              whileHover={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ ease: transition, duration: 0.6 }}
              className="fixed top-8 right-16 bg-background-800"
            >
              <Button
                LeftIcon={AiOutlineZoomIn}
                secondary
                className="flex items-center justify-center !rounded-none w-16 h-16"
                onClick={handleZoomLevel(zoom + 0.1)}
              />

              <Button
                LeftIcon={AiOutlineZoomOut}
                secondary
                className="flex items-center justify-center !rounded-none w-16 h-16"
                onClick={handleZoomLevel(zoom - 0.1)}
              />
            </motion.div>
          )}
        </BrowserView>

        <div
          className="h-full"
          style={{ width: isMobile ? "100%" : `${zoom * 100}%` }}
        >
          {children({ isSidebarOpen })}
        </div>
      </motion.div>
    </div>
  );
};

export default ReadPanel;

import ButtonTooltip from "@/components/shared/ButtonTooltip";
import CircleButton from "@/components/shared/CircleButton";
import Kbd from "@/components/shared/Kbd";
import { useReadInfo } from "@/contexts/ReadContext";
import { useReadPanel } from "@/contexts/ReadPanelContext";
import Input from "@/components/shared/Input";
import {
  fitModes,
  directions,
  useReadSettings,
} from "@/contexts/ReadSettingsContext";
import useDevice from "@/hooks/useDevice";
import { groupBy } from "@/utils";
import { getTitle } from "@/utils/data";
import classNames from "classnames";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { AiOutlineSearch } from "react-icons/ai";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";
import {
  CgArrowsShrinkH,
  CgArrowsShrinkV,
  CgArrowDown,
  CgArrowRight,
  CgArrowLeft,
} from "react-icons/cg";
import { HiOutlineArrowsExpand } from "react-icons/hi";

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

const Sidebar = () => {
  const { isMobile } = useDevice();
  const {
    state: { isSidebarOpen },
    setState,
  } = useReadPanel();
  const router = useRouter();
  const { manga, currentChapter, chapters, currentChapterIndex, setChapter } =
    useReadInfo();
  const { fitMode, setSetting, direction } = useReadSettings();

  const [filterText, setFilterText] = useState("");
  const [activeSource, setActiveSource] = useState(
    currentChapter?.source?.name || chapters[0]?.source?.name
  );

  const handleSidebarState = (isOpen: boolean) => () => {
    setState((prev) => ({ ...prev, isSidebarOpen: isOpen }));
  };

  const title = useMemo(() => getTitle(manga), [manga]);

  const sourceChapters = useMemo(
    () => chapters.filter((chapter) => chapter.source.name === activeSource),
    [activeSource, chapters]
  );

  const filteredChapters = useMemo(() => {
    return sourceChapters.filter((chapter) =>
      chapter.name.includes(filterText)
    );
  }, [filterText, sourceChapters]);

  const sources = groupBy(chapters, (data) => data.source.name);

  const handleChangeChapterIndex = (index: number) => () => {
    setChapter(sourceChapters[index]);
  };

  return (
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
      <div className="flex flex-col h-full w-full p-4 space-y-2">
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

        <MobileView>
          <div className="flex space-x-2 w-full px-2">
            {Object.keys(sources).map((source) => (
              <div
                className={classNames(
                  "text-gray-300 cursor-pointer rounded-[18px] px-2 py-1 w-[max-content] duration-300 transition",
                  activeSource === source
                    ? "bg-white text-black"
                    : "hover:text-white"
                )}
                key={source}
                onClick={() => setActiveSource(source)}
              >
                {source}
              </div>
            ))}
          </div>
        </MobileView>

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
            disabled={currentChapterIndex === 0}
            onClick={handleChangeChapterIndex(currentChapterIndex - 1)}
            shortcutKey="["
          />

          <MobileView className="grow">
            <select
              value={currentChapter.sourceChapterId}
              onChange={(e) => {
                const sourceChapterId = e.target.value;
                const chapter = sourceChapters.find(
                  (chapter) => chapter.sourceChapterId === sourceChapterId
                );

                setChapter(chapter);
              }}
              className="rounded-md py-1 px-2 appearance-none w-full bg-background-700"
            >
              {sourceChapters.map((chapter) => (
                <option
                  key={chapter.sourceChapterId}
                  value={chapter.sourceChapterId}
                >
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
            disabled={currentChapterIndex === sourceChapters.length - 1}
            onClick={handleChangeChapterIndex(currentChapterIndex + 1)}
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

              const nextDirection = directions[(index + 1) % directions.length];

              setSetting("direction", nextDirection);
            }}
            shortcutKey="D"
          />
        </div>

        {/* Desktop chapter selector */}
        <BrowserView className="grow space-y-2">
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

          <div className="flex space-x-2 w-full px-2">
            {Object.keys(sources).map((source) => (
              <div
                className={classNames(
                  "text-gray-300 cursor-pointer rounded-[18px] px-2 py-1 w-[max-content] duration-300 transition",
                  activeSource === source
                    ? "bg-white text-black"
                    : "hover:text-white"
                )}
                key={source}
                onClick={() => setActiveSource(source)}
              >
                {source}
              </div>
            ))}
          </div>
        </BrowserView>

        <BrowserView renderWithFragment>
          <ul className="h-full overflow-auto space-y-2 bg-background-900 p-2">
            {filteredChapters.map((chapter) => (
              <li
                className="relative p-2 cursor-pointer hover:bg-white/20 transition duration-300"
                key={chapter.sourceChapterId}
                onClick={() => setChapter(chapter)}
              >
                {chapter.name}

                {chapter.sourceChapterId === currentChapter.sourceChapterId && (
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
  );
};

export default Sidebar;

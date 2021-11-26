import React from "react";
import EpisodesIcon from "@/components/icons/EpisodesIcon";
import Button from "@/components/shared/Button";
import Popup from "@/components/shared/Popup";
import { Chapter } from "@/types";

interface ChapterSelectorProps {
  chapters: Chapter[];
  onChapterChange?: (chapterIndex: number) => void;
  currentChapter?: Chapter;
}

const ChapterSelector: React.FC<ChapterSelectorProps> = ({
  chapters,
  onChapterChange,
  currentChapter,
}) => {
  return (
    <Popup
      type="click"
      reference={
        <Button
          className="bg-transparent hover:bg-white/20"
          LeftIcon={EpisodesIcon}
          iconClassName="w-10 h-10 lg:w-8 lg:h-8"
        >
          <p className="hidden md:inline">Tất cả chapter</p>
        </Button>
      }
      placement="top"
    >
      <div className="bg-background-900 w-[75vw] h-[75vh] md:h-[50vh] md:w-[40vw] overflow-y-scroll scroll-bar">
        {chapters.map((chapter, index) => (
          <button
            className="w-full cursor-pointer flex p-2 items-center justify-between hover:bg-white/20"
            key={chapter.chapter_id}
            onClick={() => onChapterChange(index)}
          >
            <p className="text-xl">{chapter.name}</p>

            {chapter.chapter_id === currentChapter.chapter_id && (
              <p className="text-lg text-gray-300">Đang đọc</p>
            )}
          </button>
        ))}
      </div>
    </Popup>
  );
};

export default React.memo(ChapterSelector);

import { Chapter, Manga } from "@/types";
import React from "react";

interface ContextProps {
  manga: Manga;
  chapters: Chapter[];
  currentChapter: Chapter;
  currentChapterIndex: number;
  setChapter: (chapter_id: number) => void;
}

interface ReactContextProviderProps {
  value: ContextProps;
}

const ReadContext = React.createContext<ContextProps>(null);

export const ReadContextProvider: React.FC<ReactContextProviderProps> = ({
  children,
  value,
}) => {
  return <ReadContext.Provider value={value}>{children}</ReadContext.Provider>;
};

export const useReadInfo = () => {
  return React.useContext(ReadContext);
};

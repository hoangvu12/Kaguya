import { Chapter, ImageSource, Manga } from "@/types";
import React from "react";

interface ContextProps {
  manga: Manga;
  chapters: Chapter[];
  currentChapter: Chapter;
  currentChapterIndex: number;
  setChapter: (chapter: Chapter) => void;
  sourceId: string;
  images: ImageSource[];
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

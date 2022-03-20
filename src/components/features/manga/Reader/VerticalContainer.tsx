import { useReadInfo } from "@/contexts/ReadContext";
import { useReadPanel } from "@/contexts/ReadPanelContext";
import { useReadSettings } from "@/contexts/ReadSettingsContext";
import React, { useEffect } from "react";
import ReadImage from "./ReadImage";

const VerticalContainer: React.FC = () => {
  const { currentChapterIndex, chapters, setChapter, images } = useReadInfo();
  const { state, setState } = useReadPanel();
  const { direction } = useReadSettings();

  const handleImageVisible = (index: number) => () => {
    setState((prev) => ({ ...prev, activeImageIndex: index }));
  };

  const handleChangeChapter = (index: number) => () => {
    setChapter(chapters[index]);
  };

  useEffect(() => {
    const currentImageElement: HTMLImageElement = document.querySelector(
      `[data-index="${state.activeImageIndex}"]`
    );

    if (!currentImageElement) return;

    // https://stackoverflow.com/questions/63197942/scrollintoview-not-working-properly-with-lazy-image-load
    currentImageElement.closest("div")?.scrollIntoView();

    setTimeout(() => {
      currentImageElement.closest("div")?.scrollIntoView();
    }, 600);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction]);

  return (
    <div className="w-full h-full">
      {images.map((image, index) => (
        <div className="image-container mx-auto" key={index}>
          <ReadImage
            onVisible={handleImageVisible(index)}
            className="mx-auto"
            image={image}
            data-index={index}
          />
        </div>
      ))}

      {currentChapterIndex < chapters.length - 1 && (
        <div className="w-full h-60 p-8">
          <button
            onClick={handleChangeChapter(currentChapterIndex + 1)}
            className="w-full h-full border-2 border-dashed border-gray-600 text-gray-600 hover:border-white hover:text-white transition duration-300 flex items-center justify-center"
          >
            <p className="text-2xl">Chapter tiếp theo</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(VerticalContainer);

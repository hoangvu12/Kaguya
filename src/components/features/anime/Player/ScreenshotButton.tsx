import CircleButton from "@/components/shared/CircleButton";
import Input from "@/components/shared/Input";
import Modal from "@/components/shared/Modal";
import canvasTxt from "@/lib/canvasTxt";
import {
  array_move,
  download,
  drawImageProp,
  parseTime,
  randomString,
} from "@/utils";
import classNames from "classnames";
import {
  BackwardButton,
  ControlButton,
  ForwardButton,
  PlayPauseButton,
  useVideo,
  useVideoProps,
} from "netplayer";
import React, { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { AiOutlineCamera, AiOutlineSave } from "react-icons/ai";
import { BiDownArrowAlt, BiUpArrowAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { MdOutlinePreview } from "react-icons/md";
import { toast } from "react-toastify";
import ProgressSlider from "./ProgressSlider";

type ImagePosition = [number, number]; // [column, row]

type ImageLayout = {
  positions: {
    grid: ImagePosition;
    startColumn: number;
    startRow: number;
  }[];
  canvasWidth?: (defaultWidth: number) => number;
  canvasHeight?: (defaultHeight: number) => number;
};

type ScreenshotImage = {
  imageUrl: string;
  screenshotTime: number;
  subtitle?: string;
};

const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;

const CANVAS_COLUMNS = 12;
const CANVAS_ROWS = 12;

const MAX_IMAGES = 4;

const LAYOUTS: ImageLayout[] = [
  // =============
  // ||    1    ||
  // =============
  {
    positions: [
      {
        grid: [CANVAS_COLUMNS, CANVAS_ROWS],
        startColumn: 0,
        startRow: 0,
      },
    ],
  },

  // =============
  // ||    1    ||
  // =============
  // ||    2    ||
  // =============
  {
    positions: [
      {
        grid: [CANVAS_COLUMNS, CANVAS_ROWS / 2],
        startColumn: 0,
        startRow: 0,
      },
      {
        grid: [CANVAS_COLUMNS, CANVAS_ROWS / 2],
        startColumn: 0,
        startRow: CANVAS_COLUMNS / 2,
      },
    ],
    canvasHeight: (defaultHeight: number) => defaultHeight * 2,
  },

  // ===========================
  // ||    1     ||     2     ||
  // ===========================
  {
    positions: [
      {
        grid: [CANVAS_COLUMNS / 2, CANVAS_ROWS],
        startColumn: 0,
        startRow: 0,
      },
      {
        grid: [CANVAS_COLUMNS / 2, CANVAS_ROWS],
        startColumn: CANVAS_COLUMNS / 2,
        startRow: 0,
      },
    ],
    canvasWidth: (defaultWidth: number) => defaultWidth * 2,
  },

  // =============
  // ||    1    ||
  // =============
  // ||    2    ||
  // =============
  // ||    3    ||
  // =============
  {
    positions: [
      {
        grid: [CANVAS_COLUMNS, CANVAS_ROWS / 3],
        startColumn: 0,
        startRow: 0,
      },
      {
        grid: [CANVAS_COLUMNS, CANVAS_ROWS / 3],
        startColumn: 0,
        startRow: CANVAS_ROWS / 3,
      },
      {
        grid: [CANVAS_COLUMNS, CANVAS_ROWS / 3],
        startColumn: 0,
        startRow: (CANVAS_ROWS / 3) * 2,
      },
    ],
    canvasHeight: (defaultHeight: number) => defaultHeight * 3,
  },

  // ==========================
  // ||    1    ||           ||
  // =============     3     ||
  // ||    2    ||           ||
  // ==========================
  {
    positions: [
      {
        grid: [CANVAS_COLUMNS / 2.5, CANVAS_ROWS / 2],
        startColumn: 0,
        startRow: 0,
      },
      {
        grid: [CANVAS_COLUMNS / 2.5, CANVAS_ROWS / 2],
        startColumn: 0,
        startRow: CANVAS_COLUMNS / 2,
      },
      {
        grid: [CANVAS_COLUMNS - CANVAS_COLUMNS / 2.5, CANVAS_ROWS],
        startColumn: CANVAS_COLUMNS / 2.5,
        startRow: 0,
      },
    ],
    canvasHeight: (defaultHeight: number) => defaultHeight * 3,
    canvasWidth: (defaultWidth: number) => defaultWidth * 4,
  },

  // ==========================
  // ||    1    ||     3     ||
  // ========================||
  // ||    2    ||     4     ||
  // ==========================
  {
    positions: [
      {
        grid: [CANVAS_COLUMNS / 2, CANVAS_ROWS / 2],
        startColumn: 0,
        startRow: 0,
      },
      {
        grid: [CANVAS_COLUMNS / 2, CANVAS_ROWS / 2],
        startColumn: 0,
        startRow: CANVAS_COLUMNS / 2,
      },
      {
        grid: [CANVAS_COLUMNS / 2, CANVAS_ROWS / 2],
        startColumn: CANVAS_COLUMNS / 2,
        startRow: 0,
      },
      {
        grid: [CANVAS_COLUMNS / 2, CANVAS_ROWS / 2],
        startColumn: CANVAS_COLUMNS / 2,
        startRow: CANVAS_ROWS / 2,
      },
    ],
    canvasHeight: (defaultHeight: number) => defaultHeight * 2,
    canvasWidth: (defaultWidth: number) => defaultWidth * 2,
  },
];

const ScreenshotButton = () => {
  const { i18n } = useVideoProps();
  const { videoEl } = useVideo();
  const [images, setImages] = useState<ScreenshotImage[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [currentLayout, setCurrentLayout] = useState(LAYOUTS[0]);

  const deleteImage = (imageIndex: number) => () => {
    setImages(images.filter((_, index) => index !== imageIndex));
  };

  const rePositionImage = (oldIndex: number, newIndex: number) => () => {
    const newPositionImages = array_move(images, oldIndex, newIndex);

    setImages(newPositionImages);
  };

  const snapshot = () => {
    if (
      images?.length >= MAX_IMAGES ||
      images?.length >= currentLayout.positions.length
    ) {
      toast.error(
        `You can only screenshot ${currentLayout.positions.length} frames, please choose another layout`
      );

      return;
    }

    if (!videoEl) return;

    const subtitleEl: HTMLDivElement = document.querySelector(
      ".netplayer-subtitle"
    );

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;

    ctx.drawImage(videoEl, 0, 0);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);

      setImages([
        ...images,
        {
          imageUrl: url,
          screenshotTime: videoEl.currentTime,
          subtitle: subtitleEl?.textContent,
        },
      ]);
    });
  };

  const downloadImage = () => {
    const fileName = randomString(10) + ".png";

    download(imageUrl, fileName);
  };

  useEffect(() => {
    if (images?.length > MAX_IMAGES) return;

    (async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = currentLayout?.canvasWidth?.(IMAGE_WIDTH) || IMAGE_WIDTH;
      canvas.height =
        currentLayout?.canvasHeight?.(IMAGE_HEIGHT) || IMAGE_HEIGHT;

      const loadedImages = await Promise.all(
        images.map(async ({ imageUrl }) => {
          const img = new Image();
          img.src = imageUrl;
          await new Promise(
            (resolve) =>
              (img.onload = () => {
                resolve(null);
              })
          );
          return img;
        })
      );

      currentLayout.positions.forEach((position, index) => {
        const imageEl = loadedImages[index];
        const screenshotImage = images[index];

        const { grid, startColumn, startRow } = position;

        const [column, row] = grid;

        const canvasWidthPerColumn = canvas.width / CANVAS_COLUMNS;
        const canvasHeightPerRow = canvas.height / CANVAS_ROWS;

        const x = canvasWidthPerColumn * startColumn;
        const y = canvasHeightPerRow * startRow;

        const imageCanvasWidth = canvasWidthPerColumn * column;
        const imageCanvasHeight = canvasHeightPerRow * row;

        if (!imageEl) {
          ctx.fillStyle = "#18191a";

          ctx.fillRect(x, y, imageCanvasWidth, imageCanvasHeight);

          ctx.fillStyle = "white";
          ctx.font = `${imageCanvasWidth / 10}px "Nunito Sans"`;

          const textString = (index + 1).toString();
          const textWidth = ctx.measureText(textString).width;
          const textHeight = textWidth * 1.25;

          ctx.fillText(
            textString,
            x + imageCanvasWidth / 2 - textWidth / 2,
            y + imageCanvasHeight / 2 + textHeight / 2
          );

          ctx.lineWidth = 8;
          ctx.strokeStyle = "white";
          ctx.strokeRect(x, y, imageCanvasWidth, imageCanvasHeight);
        } else {
          drawImageProp(
            ctx,
            imageEl,
            x,
            y,
            imageCanvasWidth,
            imageCanvasHeight
          );

          if (screenshotImage?.subtitle) {
            const fontSize = imageCanvasWidth / 25;

            ctx.fillStyle = "white";

            const textString = screenshotImage.subtitle;

            canvasTxt.font = "Roboto";
            canvasTxt.stroke = true;
            canvasTxt.strokeWidth = 12;
            canvasTxt.vAlign = "bottom";
            canvasTxt.align = "center";
            canvasTxt.fontSize = fontSize;
            canvasTxt.fontWeight = "bold";

            const PADDING = 0.05;

            canvasTxt.drawText(
              ctx,
              textString,
              x,
              y,
              imageCanvasWidth,
              imageCanvasHeight - imageCanvasHeight * PADDING
            );
          }
        }
      });

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      });
    })();
  }, [currentLayout, images, videoEl]);

  return (
    <React.Fragment>
      <Modal
        reference={
          <ControlButton tooltip={i18n.controls.screenshot}>
            <AiOutlineCamera className="w-6 h-6" />
          </ControlButton>
        }
        className={classNames("max-h-screen", isMobile ? "w-11/12" : "w-2/3")}
        portalSelector=".netplayer-container"
      >
        <div className="relative">
          <div className="flex items-center justify-center w-full overflow-auto min-h-[18rem] max-h-[20rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="max-w-[30rem] max-h-[20rem] object-cover"
              alt="screenshot"
              src={imageUrl}
            />
          </div>

          <div className="my-8 flex h-full flex-col justify-between">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              {LAYOUTS.map((layout, index) => (
                <div
                  className="cursor-pointer w-32 h-24"
                  key={index}
                  onClick={() => setCurrentLayout(layout)}
                >
                  <CanvasLayout layout={layout} />
                </div>
              ))}
            </div>

            <div className="space-y-4 w-full">
              {!images?.length && (
                <p className="text-center text-2xl">
                  Click screenshot button to take a snapshot of the video
                </p>
              )}

              {images.map((image, index) => (
                <div
                  key={image.imageUrl}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <p className="text-2xl">{index + 1}</p>

                    <div className="shrink-0 w-32 aspect-h-9">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.imageUrl}
                        alt="screenshot"
                        className="object-cover"
                      />
                    </div>

                    <p>{parseTime(image.screenshotTime)}</p>

                    <Input
                      placeholder="Subtitle"
                      defaultValue={image.subtitle}
                      containerClassName="max-w-[content] bg-background-500"
                      className="bg-background-500 px-3 py-2"
                      onBlur={(event) => {
                        const text = event.target.value;

                        setImages((prevImages) => {
                          const newImages = [...prevImages];

                          newImages[index].subtitle = text;

                          return newImages;
                        });
                      }}
                    />
                  </div>

                  <div className="flex itemes-center">
                    {index !== 0 && (
                      <CircleButton
                        secondary
                        LeftIcon={BiUpArrowAlt}
                        iconClassName="w-4 h-4"
                        onClick={rePositionImage(index, index - 1)}
                      />
                    )}

                    {index !== images.length - 1 && (
                      <CircleButton
                        secondary
                        LeftIcon={BiDownArrowAlt}
                        iconClassName="w-4 h-4"
                        onClick={rePositionImage(index, index + 1)}
                      />
                    )}

                    <CircleButton
                      secondary
                      LeftIcon={CgClose}
                      iconClassName="w-4 h-4 text-red-500"
                      onClick={deleteImage(index)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 px-8 py-6 bg-background-700 sticky bottom-0">
              <ProgressSlider />

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <PlayPauseButton />
                  <BackwardButton />
                  <ForwardButton />
                </div>

                <div className="flex items-center gap-2">
                  <a href={imageUrl} target="_blank" rel="noreferrer">
                    <MdOutlinePreview className="w-6 h-6 cursor-pointer" />
                  </a>

                  <AiOutlineCamera
                    className="w-6 h-6 cursor-pointer"
                    onClick={snapshot}
                  />

                  <AiOutlineSave
                    className="w-6 h-6 cursor-pointer"
                    onClick={downloadImage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

const CanvasLayout: React.FC<{ layout: ImageLayout }> = ({ layout }) => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    (async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width =
        layout?.canvasWidth?.(canvas.offsetWidth) || canvas.offsetWidth;
      canvas.height =
        layout?.canvasHeight?.(canvas.offsetHeight) || canvas.offsetHeight;

      layout.positions.forEach((position) => {
        const { grid, startColumn, startRow } = position;

        const [column, row] = grid;

        const canvasWidthPerColumn = canvas.width / CANVAS_COLUMNS;
        const canvasHeightPerRow = canvas.height / CANVAS_ROWS;

        const x = canvasWidthPerColumn * startColumn;
        const y = canvasHeightPerRow * startRow;

        const imageCanvasWidth = canvasWidthPerColumn * column;
        const imageCanvasHeight = canvasHeightPerRow * row;

        ctx.fillStyle = "#18191a";

        ctx.fillRect(x, y, imageCanvasWidth, imageCanvasHeight);

        ctx.globalCompositeOperation = "source-over";
        ctx.lineWidth = 4;
        ctx.strokeStyle = "white";
        ctx.strokeRect(x, y, imageCanvasWidth, imageCanvasHeight);
      });
    })();
  }, [layout]);

  return <canvas className="w-full h-full" ref={canvasRef}></canvas>;
};

export default ScreenshotButton;

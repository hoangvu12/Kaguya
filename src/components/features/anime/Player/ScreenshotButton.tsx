import CircleButton from "@/components/shared/CircleButton";
import Modal from "@/components/shared/Modal";
import { array_move, download, randomString } from "@/utils";
import {
  BackwardButton,
  ControlButton,
  ForwardButton,
  PlayPauseButton,
  useVideo,
  useVideoProps,
} from "netplayer";
import React, { useEffect, useState } from "react";
import { AiOutlineCamera, AiOutlineSave } from "react-icons/ai";
import { BiDownArrowAlt, BiUpArrowAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { toast } from "react-toastify";
import ProgressSlider from "./ProgressSlider";

const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;

const ScreenshotButton = () => {
  const { i18n } = useVideoProps();
  const { videoEl } = useVideo();
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");

  const deleteImage = (imageIndex: number) => () => {
    setImages(images.filter((_, index) => index !== imageIndex));
  };

  const rePositionImage = (oldIndex: number, newIndex: number) => () => {
    const newPositionImages = array_move(images, oldIndex, newIndex);

    setImages(newPositionImages);
  };

  const snapshot = () => {
    if (images?.length >= 2) {
      toast.error("You can only screenshot 2 frames");

      return;
    }

    if (!videoEl) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;

    ctx.drawImage(videoEl, 0, 0);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);

      setImages([...images, url]);
    });
  };

  const downloadImage = () => {
    const fileName = randomString(10) + ".png";

    download(imageUrl, fileName);
  };

  useEffect(() => {
    if (!images?.length || images?.length > 2) return;

    (async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = IMAGE_WIDTH;
      canvas.height = IMAGE_HEIGHT * images.length;

      const loadedImages = await Promise.all(
        images.map(async (imageUrl) => {
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

      loadedImages.forEach((image, index) => {
        ctx.drawImage(image, 0, IMAGE_HEIGHT * index);
      });

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      });
    })();
  }, [images, videoEl]);

  return (
    <React.Fragment>
      <Modal
        reference={
          <ControlButton tooltip={i18n.controls.screenshot} onClick={snapshot}>
            <AiOutlineCamera className="w-6 h-6" />
          </ControlButton>
        }
        portalSelector=".netplayer-container"
      >
        <div className="flex gap-20 h-96">
          <div className="w-80 max-h-96">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full object-cover"
              alt="screenshot"
              src={imageUrl}
            />
          </div>

          <div className="grow flex h-full flex-col justify-between">
            <div className="space-y-2 w-full">
              {images.map((image, index) => (
                <div
                  key={image}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <p className="text-2xl">{index + 1}</p>

                    <div className="w-24 aspect-w-16 aspect-h-9">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt="screenshot"
                        className="object-cover"
                      />
                    </div>
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

            <div className="mt-8">
              <ProgressSlider />

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <PlayPauseButton />
                  <BackwardButton />
                  <ForwardButton />
                </div>

                <div className="flex items-center gap-2">
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

export default ScreenshotButton;

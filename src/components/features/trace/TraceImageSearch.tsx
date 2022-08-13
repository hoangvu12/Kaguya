import Button from "@/components/shared/Button";
import CircleButton from "@/components/shared/CircleButton";
import Input from "@/components/shared/Input";
import { isValidUrl } from "@/utils";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { AiOutlineCloudUpload, AiOutlineSearch } from "react-icons/ai";
import { MdOutlineDelete, MdOutlineRestartAlt } from "react-icons/md";
import ReactImageUploading, { ImageType } from "react-images-uploading";
import { toast } from "react-toastify";

interface TraceImageSearchProps {
  onSearch?: (image: ImageType) => void;
}

const noop = () => {};

const TraceImageSearch: React.FC<TraceImageSearchProps> = ({
  onSearch = noop,
}) => {
  const [image, setImage] = useState<ImageType>(null);
  const [inputValue, setInputValue] = useState(null);
  const { t } = useTranslation("trace");

  const handleSearch = () => {
    onSearch?.(image);
  };

  return (
    <ReactImageUploading
      onChange={(images) => {
        setImage(images[0]);
      }}
      value={[image]}
    >
      {({ dragProps, onImageUpload, isDragging, imageList, onImageRemove }) => (
        <div className="w-full md:w-[600px] rounded-lg p-8 text-center bg-background-900">
          <h2 className="text-2xl font-semibold">{t("upload_image")}</h2>
          <h2 className="text-lg text-gray-300">
            {t("upload_supported_extensions")}
          </h2>

          {imageList[0]?.dataURL ? (
            <div className="relative w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageList[0].dataURL}
                alt="uploaded image"
                className="w-full mt-4 border border-white/40"
              />

              <CircleButton
                onClick={() => {
                  onImageRemove(0);
                }}
                LeftIcon={MdOutlineDelete}
                secondary
                className="absolute top-2 right-2 !bg-background-800"
              />

              <div className="flex items-center justify-end w-full mt-4 space-x-2">
                <Button
                  secondary
                  LeftIcon={MdOutlineRestartAlt}
                  onClick={onImageUpload}
                >
                  <p>{t("upload_another_image")}</p>
                </Button>

                <Button
                  primary
                  LeftIcon={AiOutlineSearch}
                  onClick={handleSearch}
                >
                  <p>{t("common:search")}</p>
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={classNames(
                "mt-8 p-4 w-full rounded-md border border-dashed border-white/60 flex flex-col items-center justify-center transition duration-300",
                isDragging ? "bg-white/20" : "bg-background-800"
              )}
              {...dragProps}
            >
              <AiOutlineCloudUpload className="text-gray-300 w-24 h-24" />

              <p className="text-gray-300">
                {t("drag_and_drop")} {t("common:or")}{" "}
                <button
                  className="text-primary-300 hover:underline"
                  onClick={onImageUpload}
                >
                  {t("browse_files")}
                </button>{" "}
              </p>

              <div className="mt-1 flex items-center space-x-2">
                <Input
                  placeholder="URL"
                  className="px-3 py-2 !bg-background-900"
                  onChange={(e) => {
                    // @ts-ignore
                    setInputValue(e.target.value);
                  }}
                />

                <Button
                  primary
                  onClick={() => {
                    if (!isValidUrl(inputValue)) {
                      return toast.error(t("invalid_url"));
                    }

                    setImage({
                      dataURL: inputValue,
                    });
                  }}
                >
                  <p>{t("upload")}</p>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </ReactImageUploading>
  );
};

export default React.memo(TraceImageSearch);

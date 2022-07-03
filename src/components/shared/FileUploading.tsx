import classNames from "classnames";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import ReactFileUploading, {
  FileUploadingPropsType,
} from "react-files-uploading";
import { ExportInterface } from "react-files-uploading/dist/typings";
import {
  AiFillFileAdd,
  AiOutlineCloudUpload,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineFile,
} from "react-icons/ai";
import BaseButton from "./BaseButton";
import Button from "./Button";
import { humanFileSize } from "@/utils";

export interface FileUploadingProps extends Partial<FileUploadingPropsType> {
  initialFiles?: File[];
}

interface FileUploadingUIProps extends ExportInterface {
  multiple?: boolean;
}

interface FileBoxProps {
  file: {
    name: string;
    size: number;
  };
  index: number;
  onFileRemove?: (index: number) => void;
  onFileUpdate?: (index: number) => void;
}

export const FileBox: React.FC<FileBoxProps> = ({
  file,
  onFileRemove,
  onFileUpdate,
  index,
}) => (
  <div className="p-2 w-40 h-40 flex items-end relative bg-background-900 rounded-md">
    <AiOutlineFile className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-16" />

    <p className="text-sm line-clamp-1">{file.name}</p>

    <p className="absolute top-2 left-2">{humanFileSize(file.size)}</p>

    <div className="bg-background-800 absolute -top-2 -right-2 flex items-center">
      {onFileUpdate && (
        <Button
          secondary
          onClick={() => onFileUpdate(index)}
          LeftIcon={AiOutlineEdit}
          iconClassName="w-6 h-6"
          className="!p-1"
        />
      )}

      {onFileRemove && (
        <Button
          secondary
          onClick={() => onFileRemove(index)}
          LeftIcon={AiOutlineDelete}
          iconClassName="text-red-500 w-6 h-6"
          className="!p-1"
        />
      )}
    </div>
  </div>
);

export const FileUploader: React.FC<ExportInterface> = ({
  isDragging,
  dragProps,
  onFileUpload,
}) => {
  const { t } = useTranslation("file_uploading");

  return (
    <div
      className={classNames(
        "p-4 w-full rounded-md border border-dashed border-white/60 flex flex-col items-center justify-center transition duration-300",
        isDragging ? "bg-white/20" : "bg-background-900"
      )}
      {...dragProps}
    >
      <AiOutlineCloudUpload className="text-gray-300 w-24 h-24" />

      <p className="text-gray-300">
        {t("drag_and_drop")} {t("common:or")}{" "}
        <button
          className="text-primary-300 hover:underline"
          onClick={onFileUpload}
          type="button"
        >
          {t("browse_files")}
        </button>{" "}
      </p>
    </div>
  );
};

export const FileUploadedList: React.FC<FileUploadingUIProps> = ({
  fileList,
  onFileRemove,
  onFileUpdate,
  multiple,
  onFileUpload,
}) => {
  return (
    <div className="flex gap-4 items-center flex-wrap">
      {fileList.map((file, index) => (
        <FileBox
          file={file}
          index={index}
          onFileRemove={onFileRemove}
          onFileUpdate={onFileUpdate}
          key={`file-${index}`}
        />
      ))}

      {multiple && (
        <BaseButton
          LeftIcon={AiFillFileAdd}
          onClick={onFileUpload}
          className="flex items-center justify-center w-40 h-40 border border-dashed border-gray-300 hover:border-white bg-transparent"
          iconClassName="w-16 h-16"
        />
      )}
    </div>
  );
};

const FileUploadingUI: React.FC<FileUploadingUIProps> = (props) => {
  if (props.fileList.length === 0) {
    return <FileUploader {...props} />;
  }

  return <FileUploadedList {...props} />;
};

const FileUploading: React.FC<FileUploadingProps> = ({
  initialFiles,
  children,
  onChange,
  ...props
}) => {
  const [files, setFiles] = useState<File[]>(initialFiles);

  const handleChange = (fileList: File[], addUpdatedIndex?: Array<number>) => {
    setFiles(fileList);
    onChange?.(fileList, addUpdatedIndex);
  };

  return (
    <ReactFileUploading value={files} onChange={handleChange} {...props}>
      {(exportProps) =>
        children?.(exportProps) || (
          <FileUploadingUI {...exportProps} multiple={props.multiple} />
        )
      }
    </ReactFileUploading>
  );
};

export default FileUploading;

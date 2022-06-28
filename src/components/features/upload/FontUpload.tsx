import FileUploading from "@/components/shared/FileUploading";
import { supportedUploadFontFormats } from "@/constants";
import React from "react";
import { FileUploadingPropsType } from "react-files-uploading";

const FontUpload: React.FC<Partial<FileUploadingPropsType>> = (props) => {
  return (
    <FileUploading
      multiple
      acceptType={supportedUploadFontFormats}
      {...props}
    />
  );
};

export default FontUpload;

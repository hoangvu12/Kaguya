import BaseButton from "@/components/shared/BaseButton";
import FileUploading, {
  FileBox,
  FileUploader,
  FileUploadingProps,
} from "@/components/shared/FileUploading";
import Input from "@/components/shared/Input";
import { supportedUploadSubtitleFormats } from "@/constants";
import { randomString } from "@/utils";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiFillFileAdd } from "react-icons/ai";

export interface SubtitleFile {
  file: File;
  name: string;
  locale: string;
}

interface SubtitleUploadProps extends Omit<FileUploadingProps, "onChange"> {
  onChange: (files: SubtitleFile[]) => void;
  initialSubtitles?: SubtitleFile[];
}

const SubtitleUpload: React.FC<Partial<SubtitleUploadProps>> = ({
  onChange,
  initialSubtitles = [],
  ...props
}) => {
  const { locale } = useRouter();
  const [filesCtx, setFilesCtx] = useState<SubtitleFile[]>(initialSubtitles);
  const [files, setFiles] = useState<File[]>(
    initialSubtitles.map((subtitle) => subtitle.file)
  );

  const handleChange = (files: File[]) => {
    setFiles(files);
    onChange?.(filesCtx);
  };

  return (
    <FileUploading
      value={files}
      multiple
      acceptType={supportedUploadSubtitleFormats}
      onChange={handleChange}
      {...props}
    >
      {(props) => {
        if (props.fileList.length === 0) {
          return <FileUploader {...props} />;
        }

        return (
          <div className="space-y-4">
            {props.fileList.map((file, index) => {
              const fileKey = randomString(8);

              if (!filesCtx[index]) {
                filesCtx[index] = {
                  file,
                  locale,
                  name: file.name.replace(/\.[^/.]+$/, ""),
                };
              }

              const fileContext = filesCtx[index];

              return (
                <div
                  className="flex flex-col gap-4 md:flex-row md:gap-8 flex-wrap"
                  key={fileKey}
                >
                  <FileBox
                    file={file}
                    index={index}
                    onFileRemove={() => {
                      filesCtx.splice(index, 1);

                      props.onFileRemove(index);
                    }}
                    key={`file-${index}`}
                  />

                  <div className="space-y-2 flex-1">
                    <div className="space-y-1">
                      <label>Tên subtitle (VD: Tiếng Việt)</label>

                      <Input
                        onChange={(e) => {
                          const target = e.target as HTMLInputElement;

                          fileContext.name = target.value;

                          filesCtx[index] = fileContext;

                          setFilesCtx(filesCtx);
                        }}
                        containerClassName="w-full"
                        className="px-3 py-2"
                        placeholder="Tên subtitle"
                        defaultValue={filesCtx[index].name}
                      />
                    </div>
                    <div className="space-y-1">
                      <label>Ngôn ngữ (VD: vi hoặc en)</label>

                      <Input
                        onChange={(e) => {
                          const target = e.target as HTMLInputElement;

                          fileContext.locale = target.value;

                          filesCtx[index] = fileContext;

                          setFilesCtx(filesCtx);
                        }}
                        containerClassName="w-full"
                        className="px-3 py-2"
                        placeholder="Ngôn ngữ"
                        defaultValue={filesCtx[index].locale}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <BaseButton
              LeftIcon={AiFillFileAdd}
              onClick={props.onFileUpload}
              className="flex items-center justify-center w-40 h-40 border border-dashed border-gray-300 hover:border-white bg-transparent"
              iconClassName="w-16 h-16"
            />
          </div>
        );
      }}
    </FileUploading>
  );
};

export default SubtitleUpload;

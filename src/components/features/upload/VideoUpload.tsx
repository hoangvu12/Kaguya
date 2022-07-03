import Button from "@/components/shared/Button";
import FileUploading, { FileUploader } from "@/components/shared/FileUploading";
import { supportedUploadVideoFormats } from "@/constants";
import { useRef } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

interface VideoUploadProps {
  onChange?: (video: File | string) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onChange }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = (fileList: File[]) => {
    onChange?.(fileList[0]);
  };

  const handleTextAreaBlur = () => {
    onChange?.(textAreaRef.current.value);
  };

  return (
    <Tabs selectedTabClassName="bg-primary-500 rounded-md">
      <TabList className="flex items-center gap-2 mb-4">
        <Tab className="cursor-pointer p-2">Upload bằng file</Tab>
        <Tab className="cursor-pointer p-2">Upload bằng url</Tab>
      </TabList>

      <TabPanel>
        <FileUploading
          onChange={handleFileChange}
          acceptType={supportedUploadVideoFormats}
        >
          {(props) => {
            const file = props.fileList[0];

            if (!file) {
              return <FileUploader {...props} />;
            }

            const src = URL.createObjectURL(file);

            return (
              <div className="relative">
                <div className="relative w-full flex items-center aspect-w-16 aspect-h-9">
                  <video controls src={src} className="object-contain" />
                </div>
                <div className="bg-background-800 absolute -top-2 -right-2 flex items-center">
                  <Button
                    secondary
                    onClick={() => props.onFileUpdate(0)}
                    LeftIcon={AiOutlineEdit}
                    iconClassName="w-6 h-6"
                    className="!p-1"
                  />

                  <Button
                    secondary
                    onClick={() => props.onFileRemove(0)}
                    LeftIcon={AiOutlineDelete}
                    iconClassName="text-red-500 w-6 h-6"
                    className="!p-1"
                  />
                </div>
              </div>
            );
          }}
        </FileUploading>
      </TabPanel>
      <TabPanel>
        <textarea
          ref={textAreaRef}
          onBlur={handleTextAreaBlur}
          className="mt-2 p-2 w-full h-36 bg-background-900 text-white border-gray-300 border"
          placeholder="Nhập URL muốn upload (VD: https://example.com/video.mp4)"
        />
      </TabPanel>
    </Tabs>
  );
};

export default VideoUpload;

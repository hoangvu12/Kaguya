import FileUploading from "@/components/shared/FileUploading";
import { supportedUploadVideoFormats } from "@/constants";
import { useRef } from "react";
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
        />
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

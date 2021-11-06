import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export interface VideoOptions {
  qualities?: number[];
  currentQuality?: number;
  isLocked?: boolean;
}

interface ContextProps {
  options: VideoOptions;
  setOptions: Dispatch<SetStateAction<VideoOptions>>;
}

const defaultValue = {
  options: { qualities: [], currentQuality: 0, isLocked: false },
  setOptions: () => {},
};

const VideoContext = createContext<ContextProps>(defaultValue);

export const VideoOptionsProvider: React.FC = ({ children }) => {
  const [options, setOptions] = useState<VideoOptions>(defaultValue.options);

  return (
    <VideoContext.Provider value={{ options, setOptions }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoOptions = () => {
  return useContext(VideoContext);
};

export default VideoContext;

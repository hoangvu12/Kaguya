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
}

interface ContextProps {
  options: VideoOptions;
  setOptions: Dispatch<SetStateAction<VideoOptions>>;
}

const VideoContext = createContext<ContextProps>({
  options: { qualities: [], currentQuality: 0 },
  setOptions: () => {},
});

export const VideoOptionsProvider: React.FC = ({ children }) => {
  const [options, setOptions] = useState<VideoOptions>();

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

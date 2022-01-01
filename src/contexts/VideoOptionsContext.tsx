import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
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

interface ProviderProps {
  defaultQualities?: number[];
  onQualityChange?: (quality: number) => void;
}

const defaultValue = {
  options: { qualities: [], currentQuality: 0, isLocked: false },
  setOptions: () => {},
} as ContextProps;

const VideoContext = createContext<ContextProps>(defaultValue);

export const VideoOptionsProvider: React.FC<ProviderProps> = ({
  children,
  defaultQualities,
  onQualityChange,
}) => {
  const [options, setOptions] = useState<VideoOptions>(() => {
    if (defaultQualities.length) {
      defaultValue.options.qualities = defaultQualities;
    }

    return defaultValue.options;
  });

  useEffect(() => {
    onQualityChange?.(options.currentQuality);
  }, [onQualityChange, options.currentQuality]);

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

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export interface VideoOptions {
  qualities?: string[];
  currentQuality?: string;
  isLocked?: boolean;
}

interface ContextProps {
  options: VideoOptions;
  setOptions: Dispatch<SetStateAction<VideoOptions>>;
}

interface ProviderProps {
  defaultQualities?: string[];
  onQualityChange?: (quality: string) => void;
}

const defaultValue = {
  options: { qualities: [], currentQuality: "NONE", isLocked: false },
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

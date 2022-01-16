import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export interface VideoState {
  qualities?: string[];
  currentQuality?: string;
  isLocked?: boolean;
}

interface ContextProps {
  state: VideoState;
  setState: Dispatch<SetStateAction<VideoState>>;
}

interface ProviderProps {
  defaultQualities?: string[];
  onQualityChange?: (quality: string) => void;
}

const defaultValue = {
  state: { qualities: [], currentQuality: "NONE", isLocked: false },
  setState: () => {},
} as ContextProps;

const VideoContext = createContext<ContextProps>(defaultValue);

export const VideoStateProvider: React.FC<ProviderProps> = ({
  children,
  defaultQualities,
  onQualityChange,
}) => {
  const [state, setState] = useState<VideoState>(() => {
    if (defaultQualities.length) {
      defaultValue.state.qualities = defaultQualities;
    }

    return defaultValue.state;
  });

  useEffect(() => {
    onQualityChange?.(state.currentQuality);
  }, [onQualityChange, state.currentQuality]);

  return (
    <VideoContext.Provider value={{ state, setState }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoState = () => {
  return useContext(VideoContext);
};

export default VideoContext;

import { Subtitle } from "@/types";
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
  currentSubtitle?: string;
  subtitles?: Subtitle[];
  isSubtitleEnabled?: boolean;
}

interface ContextProps {
  state: VideoState;
  setState: Dispatch<SetStateAction<VideoState>>;
}

interface ProviderProps {
  defaultQualities?: string[];
  subtitles?: Subtitle[];
}

const defaultValue = {
  state: {
    qualities: [],
    currentQuality: "",
    subtitles: [],
    currentSubtitle: "vi",
    isSubtitleEnabled: true,
  },
  setState: () => {},
} as ContextProps;

const VideoContext = createContext<ContextProps>(defaultValue);

export const VideoStateProvider: React.FC<ProviderProps> = ({
  children,
  defaultQualities,
  subtitles,
}) => {
  const [state, setState] = useState<VideoState>(() => {
    defaultValue.state.qualities = defaultQualities;
    defaultValue.state.currentQuality = defaultQualities[0] || "";
    defaultValue.state.subtitles = subtitles;

    return defaultValue.state;
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      currentSubtitle: "vi",
      qualities: defaultQualities,
      subtitles,
    }));
  }, [defaultQualities, subtitles]);

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

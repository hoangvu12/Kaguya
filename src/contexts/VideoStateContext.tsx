import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export interface VideoState {
  qualities?: string[];
  currentQuality?: string;
}

interface ContextProps {
  state: VideoState;
  setState: Dispatch<SetStateAction<VideoState>>;
}

interface ProviderProps {
  defaultQualities?: string[];
}

const defaultValue = {
  state: { qualities: [], currentQuality: "" },
  setState: () => {},
} as ContextProps;

const VideoContext = createContext<ContextProps>(defaultValue);

export const VideoStateProvider: React.FC<ProviderProps> = ({
  children,
  defaultQualities,
}) => {
  const [state, setState] = useState<VideoState>(() => {
    if (defaultQualities.length) {
      defaultValue.state.qualities = defaultQualities;
    }

    return defaultValue.state;
  });

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

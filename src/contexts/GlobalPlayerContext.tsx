import { WatchPlayerProps } from "@/components/features/anime/WatchPlayer";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isMobile } from "react-device-detect";
import { WatchPlayerContextProps } from "./WatchContext";

const WatchPlayer = dynamic(
  () => import("@/components/features/anime/WatchPlayer"),
  {
    ssr: false,
  }
);

interface PlayerProps extends WatchPlayerProps {
  ref?: React.RefObject<HTMLVideoElement>;
}

const ForwardRefPlayer = React.memo(
  React.forwardRef<HTMLVideoElement, WatchPlayerProps>((props, ref) => (
    <WatchPlayer {...props} videoRef={ref} />
  ))
);

ForwardRefPlayer.displayName = "ForwardRefPlayer";

interface ContextProps {
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerProps>>;
  setPlayerProps: React.Dispatch<React.SetStateAction<WatchPlayerContextProps>>;
  playerProps: WatchPlayerContextProps;
  isBackground: boolean;
}

const PlayerContext = createContext<ContextProps>(null);

const GlobalPlayerContextProvider: React.FC = ({ children }) => {
  const [playerState, setPlayerState] = useState<PlayerProps>(null);
  const [playerProps, setPlayerProps] = useState<WatchPlayerContextProps>(null);
  const dragConstraintsRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const shouldPlayInBackground = useMemo(() => {
    return !router?.pathname.includes("watch") && !isMobile;
  }, [router?.pathname]);

  return (
    <PlayerContext.Provider
      value={{
        setPlayerState,
        isBackground: shouldPlayInBackground && !!playerState?.sources,
        playerProps,
        setPlayerProps,
      }}
    >
      {children}

      {!!playerState?.sources ? (
        <div
          className={classNames(
            "fixed",
            shouldPlayInBackground && "bottom-4 right-4 z-[9999]"
          )}
        >
          <AnimatePresence initial={false}>
            <div
              ref={dragConstraintsRef}
              className="fixed inset-0 pointer-events-none"
            />

            <motion.div
              layout
              drag={shouldPlayInBackground}
              dragElastic={0}
              dragMomentum={false}
              dragConstraints={dragConstraintsRef}
              style={{
                width: shouldPlayInBackground ? 400 : "100vw",
                height: shouldPlayInBackground ? 225 : "100vh",
              }}
            >
              <ForwardRefPlayer {...playerState} />
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}
    </PlayerContext.Provider>
  );
};

export const useGlobalPlayer = (
  state: {
    playerState?: PlayerProps;
    playerProps?: WatchPlayerContextProps;
  } = {}
) => {
  const { setPlayerState, setPlayerProps, ...rest } =
    React.useContext(PlayerContext);

  useEffect(() => {
    if (state?.playerState) {
      setPlayerState(state.playerState);
    }

    if (state?.playerProps) {
      setPlayerProps(state.playerProps);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state?.playerState?.sources,
    state?.playerProps?.anime,
    state?.playerProps?.currentEpisode,
  ]);

  return {
    setPlayerState,
    ...rest,
  };
};

export default GlobalPlayerContextProvider;

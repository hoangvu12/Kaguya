import { WatchPlayerProps } from "@/components/features/anime/WatchPlayer";
import classNames from "classnames";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  Variants,
} from "framer-motion";
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

const playerVariants: Variants = {
  watch: {
    width: "100vw",
    height: "100vh",
  },
  background: {
    width: 400,
    height: 225,
  },
};

const PlayerContext = createContext<ContextProps>(null);

const GlobalPlayerContextProvider: React.FC = ({ children }) => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [playerState, setPlayerState] = useState<PlayerProps>(null);
  const [playerProps, setPlayerProps] = useState<WatchPlayerContextProps>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const router = useRouter();

  const shouldPlayInBackground = useMemo(() => {
    return !router?.pathname.includes("watch");
  }, [router?.pathname]);

  useEffect(() => {
    if (shouldPlayInBackground) return;

    // Set the player position just in case it is dragged
    x.set(0);
    y.set(0);
  }, [shouldPlayInBackground, x, y]);

  const playerSize = useMemo(() => {
    if (!shouldPlayInBackground) {
      return {
        width: "100vw",
        height: "100vh",
      };
    }

    if (isMobile) {
      return {
        width: 320,
        height: 180,
      };
    }

    return {
      width: 400,
      height: 225,
    };
  }, [shouldPlayInBackground]);

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

      <div
        className="fixed inset-0 pointer-events-none"
        ref={constraintsRef}
      ></div>

      {!!playerState?.sources ? (
        <AnimatePresence initial={false}>
          <div
            className={classNames(
              "fixed shadow-2xl",
              shouldPlayInBackground && "bottom-4 right-4 z-[9999]"
            )}
          >
            <motion.div
              dragElastic={0}
              drag={shouldPlayInBackground}
              dragMomentum={false}
              dragConstraints={constraintsRef}
              style={{
                width: playerSize.width,
                height: playerSize.height,
                x,
                y,
              }}
            >
              <ForwardRefPlayer {...playerState} />
            </motion.div>
          </div>
        </AnimatePresence>
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

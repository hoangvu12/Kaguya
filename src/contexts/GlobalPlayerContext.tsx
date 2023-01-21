import LocaleEpisodeSelector from "@/components/features/anime/Player/LocaleEpisodeSelector";
import { WatchPlayerProps } from "@/components/features/anime/WatchPlayer";
import EpisodesIcon from "@/components/icons/EpisodesIcon";
import CircleButton from "@/components/shared/CircleButton";
import Popup from "@/components/shared/Popup";
import { createProxyUrl } from "@/utils";
import classNames from "classnames";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
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
import { AiOutlineClose, AiOutlineExpandAlt } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import { toast } from "react-toastify";
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
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [playerState, setPlayerState] = useState<PlayerProps>(null);
  const [playerProps, setPlayerProps] = useState<WatchPlayerContextProps>(null);
  const alertRef = useRef<Boolean>(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const router = useRouter();

  const shouldPlayInBackground = useMemo(() => {
    return !router?.pathname.includes("watch");
  }, [router?.pathname]);

  useEffect(() => {
    if (shouldPlayInBackground && !isMobile) return;

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

    return {
      width: 400,
      height: 225,
    };
  }, [shouldPlayInBackground]);

  const playerSource = useMemo(() => {
    return playerProps?.sources[0];
  }, [playerProps?.sources]);

  const isEmbed = useMemo(() => {
    return playerSource?.isEmbed;
  }, [playerSource?.isEmbed]);

  useEffect(() => {
    if (isEmbed && !alertRef.current) {
      toast.info("Embed videos might contain ads.");

      alertRef.current = true;
    }
  }, [isEmbed]);

  useEffect(() => {
    import("@/lib/x-frame-bypass");
  }, []);

  const playerSrc = useMemo(() => {
    return playerSource?.useProxy || playerSource?.usePublicProxy
      ? createProxyUrl(
          playerSource?.file,
          playerSource?.proxy,
          playerSource?.usePublicProxy
        )
      : playerSource?.file;
  }, [
    playerSource?.file,
    playerSource?.proxy,
    playerSource?.useProxy,
    playerSource?.usePublicProxy,
  ]);

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
              {!isEmbed ? (
                <ForwardRefPlayer {...playerState} />
              ) : (
                <React.Fragment>
                  {!shouldPlayInBackground && (
                    <BsArrowLeft
                      className={classNames(
                        "transition-al absolute top-10 left-10 h-10 w-10 cursor-pointer duration-300 hover:text-gray-200"
                      )}
                      onClick={router.back}
                    />
                  )}

                  {!shouldPlayInBackground && playerProps?.anime?.id && (
                    // I have no idea why Tailwind doesn't work, have to use inline styles instead.
                    <div
                      className="absolute"
                      style={{ top: "2.5rem", right: "2.5rem" }}
                    >
                      <Popup
                        reference={
                          <EpisodesIcon
                            className={classNames(
                              "transition-al h-10 w-10 cursor-pointer duration-300 hover:text-gray-200"
                            )}
                          />
                        }
                        placement="top"
                        type="click"
                      >
                        <div className="w-[70vw] overflow-hidden bg-background-900 p-4">
                          <LocaleEpisodeSelector
                            mediaId={playerProps.anime.id}
                            episodes={playerProps.episodes}
                            activeEpisode={playerProps.currentEpisode}
                            episodeLinkProps={{ shallow: true, replace: true }}
                          />
                        </div>
                      </Popup>
                    </div>
                  )}

                  {shouldPlayInBackground && (
                    <div className="flex items-center gap-2 absolute top-4 left-4">
                      <div className="w-8 h-8">
                        <CircleButton
                          secondary
                          iconClassName="w-6 h-6"
                          className={"visible opacity-100"}
                          onClick={() =>
                            router.push(
                              `/anime/watch/${playerProps?.anime?.id}/${playerProps?.currentEpisode?.sourceId}/${playerProps?.currentEpisode?.sourceEpisodeId}`
                            )
                          }
                          LeftIcon={AiOutlineExpandAlt}
                        />
                      </div>
                      <div className="w-8 h-8">
                        <CircleButton
                          secondary
                          iconClassName="w-6 h-6"
                          className={"visible opacity-100"}
                          onClick={() => setPlayerState(null)}
                          LeftIcon={AiOutlineClose}
                        />
                      </div>
                    </div>
                  )}

                  <iframe
                    is="x-frame-bypass"
                    className="w-full h-full"
                    // @ts-ignore
                    // Custom attribute
                    target={playerSource?.file}
                    proxy={playerSource.useProxy || playerSource.usePublicProxy}
                    src={playerSrc}
                  />
                </React.Fragment>
              )}
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

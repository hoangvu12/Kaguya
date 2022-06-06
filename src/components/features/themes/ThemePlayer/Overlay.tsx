import PlayerOverlay from "@/components/features/anime/Player/Overlay";
import Loading from "@/components/shared/Loading";
import { useThemePlayer } from "@/contexts/ThemePlayerContext";
import { download, getFileNameFromUrl } from "@/utils";
import classNames from "classnames";
import { useInteract } from "netplayer";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineDownload, AiOutlineInfoCircle } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import ThemeSearch from "../ThemeSearch";
import ProgressSlider from "./ProgressSlider";

const Overlay = () => {
  const { isLoading, theme } = useThemePlayer();
  const { isInteracting } = useInteract();
  const router = useRouter();

  return (
    <PlayerOverlay className="relative">
      <div className="absolute top-0 w-full bg-gradient-to-b h-16 from-black/60 via-black/40 to-transparent"></div>

      <BsArrowLeft
        className={classNames(
          "absolute w-8 h-8 transition-all duration-300 cursor-pointer top-4 left-4 hover:text-gray-200",
          isInteracting ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={router.back}
      />

      {theme?.anilistId && (
        <Link href={`/anime/details/${theme.anilistId}`}>
          <a
            target="_blank"
            className={classNames(
              "absolute transition-all duration-300 cursor-pointer top-4 right-28 hover:text-gray-200",
              isInteracting ? "opacity-100 visible" : "opacity-0 invisible"
            )}
          >
            <AiOutlineInfoCircle className={classNames("w-8 h-8")} />
          </a>
        </Link>
      )}

      {theme?.sources?.length && (
        <AiOutlineDownload
          className={classNames(
            "w-8 h-8 absolute transition-all duration-300 cursor-pointer top-4 right-16 hover:text-gray-200",
            isInteracting ? "opacity-100 visible" : "opacity-0 invisible"
          )}
          onClick={(e) => {
            e.stopPropagation();

            download(
              theme.sources[0].file,
              getFileNameFromUrl(theme.sources[0].file)
            );
          }}
        />
      )}

      <ThemeSearch
        className={classNames(
          "w-8 h-8 absolute transition-all duration-300 cursor-pointer top-4 right-4 hover:text-gray-200",
          isInteracting ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      />

      <div className="w-full absolute top-0 z-50">
        <ProgressSlider />
      </div>

      {isLoading && <Loading />}
    </PlayerOverlay>
  );
};

export default Overlay;

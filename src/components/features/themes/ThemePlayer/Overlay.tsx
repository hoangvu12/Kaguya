import PlayerOverlay from "@/components/features/anime/Player/Overlay";
import Loading from "@/components/shared/Loading";
import { useThemePlayer } from "@/contexts/ThemePlayerContext";
import classNames from "classnames";
import { useInteract } from "netplayer";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import ProgressSlider from "./ProgressSlider";

const Overlay = () => {
  const { isLoading, theme } = useThemePlayer();
  const { isInteracting } = useInteract();
  const router = useRouter();

  return (
    <PlayerOverlay className="relative">
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
              "absolute transition-all duration-300 cursor-pointer top-4 right-4 hover:text-gray-200",
              isInteracting ? "opacity-100 visible" : "opacity-0 invisible"
            )}
          >
            <AiOutlineInfoCircle className={classNames("w-8 h-8")} />
          </a>
        </Link>
      )}

      <div className="w-full absolute top-0 z-50">
        <ProgressSlider />
      </div>

      {isLoading && <Loading />}
    </PlayerOverlay>
  );
};

export default Overlay;

import React, { useEffect, useMemo, useState } from "react";
import { parse } from "@plussub/srt-vtt-parser";
import { buildAbsoluteURL } from "url-toolkit";
import { isValidUrl } from "@/utils";
import classNames from "classnames";
import {
  useVideoState,
  useSubtitleSettings,
  useTextScaling,
  useVideo,
  useInteract,
} from "netplayer";
import { isDesktop } from "react-device-detect";
import { useGlobalPlayer } from "@/contexts/GlobalPlayerContext";

const textStyles = {
  none: "",
  outline: `black 0px 0px 3px, black 0px 0px 3px, black 0px 0px 3px, black 0px 0px 3px, black 0px 0px 3px`,
};

const BASE_FONT_SIZE = 16;

const M3U8_SUBTITLE_REGEX = /.*\.(vtt|srt)/g;

const requestSubtitle = async (url: string): Promise<string | null> => {
  if (url.includes("vtt") || url.includes("srt")) {
    const response = await fetch(url);
    const text = await response.text();

    return text;
  }

  if (url.includes("m3u8")) {
    const response = await fetch(url);
    const text = await response.text();

    const matches = text.match(M3U8_SUBTITLE_REGEX);

    if (!matches?.length) return null;

    const nextUrl = isValidUrl(matches[0])
      ? matches[0]
      : buildAbsoluteURL(url, matches[0]);

    return requestSubtitle(nextUrl);
  }

  return null;
};

const Subtitle = () => {
  const { state } = useVideoState();
  const { state: subtitleSettings } = useSubtitleSettings();
  const { moderateScale } = useTextScaling();
  const { isBackground } = useGlobalPlayer();
  const { videoEl } = useVideo();
  const { isInteracting } = useInteract();
  const [currentText, setCurrentText] = useState<string>("");
  const [subtitleText, setSubtitleText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const subtitle = useMemo(
    () => state.subtitles?.find((sub) => sub.lang === state.currentSubtitle),
    [state.subtitles, state.currentSubtitle]
  );

  useEffect(() => {
    if (!subtitle?.file) return;

    const getSubtitle = async () => {
      setIsLoading(true);

      const text = await requestSubtitle(subtitle.file);

      setIsLoading(false);

      if (!text) return;

      setSubtitleText(text);
    };

    getSubtitle();
  }, [subtitle]);

  useEffect(() => {
    if (!subtitleText) return;
    if (!videoEl) return;

    const { entries = [] } = parse(subtitleText);

    const handleSubtitle = () => {
      const currentTime = videoEl.currentTime * 1000;
      const currentEntry = entries.find(
        (entry) => entry.from <= currentTime && entry.to >= currentTime
      );

      setCurrentText(currentEntry?.text || "");
    };

    videoEl.addEventListener("timeupdate", handleSubtitle);

    return () => {
      videoEl.removeEventListener("timeupdate", handleSubtitle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtitleText]);

  if (isLoading || !subtitle?.file || !currentText || state.isSubtitleDisabled)
    return null;

  return (
    <div
      className={classNames(
        "netplayer-subtitle absolute left-1/2 -translate-x-1/2 w-[80%] flex items-center justify-evenly transition-all duration-300",
        isInteracting && isDesktop && !isBackground ? "bottom-24" : "bottom-4"
      )}
    >
      <p
        className="w-fit text-white bg-black/80 rounded-sm leading-7 text-center py-1 px-2 whitespace-pre-wrap"
        style={{
          fontSize: moderateScale(subtitleSettings.fontSize * BASE_FONT_SIZE),
          backgroundColor: `rgba(0, 0, 0, ${subtitleSettings.backgroundOpacity})`,
          color: `rgba(255, 255, 255, ${subtitleSettings.fontOpacity})`,
          textShadow: textStyles[subtitleSettings.textStyle],
        }}
        dangerouslySetInnerHTML={{ __html: currentText }}
      ></p>
    </div>
  );
};

export default Subtitle;

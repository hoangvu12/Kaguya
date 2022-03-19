import NestedMenu from "@/components/shared/NestedMenu";
import { useVideoState } from "@/contexts/VideoStateContext";
import useDevice from "@/hooks/useDevice";
import { Subtitle } from "@/types";
import React from "react";
import { MdOutlineSubtitles } from "react-icons/md";

const SubtitleSelector = () => {
  const { state, setState } = useVideoState();
  const { isMobile } = useDevice();

  const handleSubtitleChange = (subtitle: Subtitle) => () => {
    setState((prev) => ({ ...prev, currentSubtitle: subtitle.lang }));
  };

  const handleDisableSubtitle = () => {
    setState((prev) => ({ ...prev, isSubtitleEnabled: false }));
  };

  return (
    !!state.subtitles?.length && (
      <NestedMenu.SubMenu
        title="Phụ đề"
        Icon={MdOutlineSubtitles}
        menuKey="subtitle"
        activeItemKey={!state.isSubtitleEnabled ? "off" : state.currentSubtitle}
      >
        {isMobile ? (
          <select
            className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-white bg-background-800 bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0
      focus:text-white focus:bg-background-700 focus:border-primary-500 focus:outline-none"
            onChange={(e) => {
              const subtitleLang = e.target.value as string;

              if (subtitleLang === "off") {
                handleDisableSubtitle();

                return;
              }

              const subtitle = state.subtitles?.find(
                (sub) => sub.lang === subtitleLang
              );

              handleSubtitleChange(subtitle)();
            }}
          >
            <option selected={!state.isSubtitleEnabled} key="off" value="off">
              Tắt phụ đề
            </option>

            {state?.subtitles?.map((subtitle) => (
              <option
                selected={subtitle.lang === state.currentSubtitle}
                key={subtitle.lang}
                value={subtitle.lang}
              >
                {subtitle.language}
              </option>
            ))}
          </select>
        ) : (
          <>
            <NestedMenu.Item
              title="Tắt phụ đề"
              key="off"
              itemKey="off"
              onClick={handleDisableSubtitle}
            />

            {state?.subtitles?.map((subtitle) => (
              <NestedMenu.Item
                title={subtitle.language}
                key={subtitle.lang}
                itemKey={subtitle.lang}
                onClick={handleSubtitleChange(subtitle)}
              />
            ))}
          </>
        )}
      </NestedMenu.SubMenu>
    )
  );
};

export default SubtitleSelector;

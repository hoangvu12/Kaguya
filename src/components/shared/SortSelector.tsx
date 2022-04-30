import Popup from "@/components/shared/Popup";
import TextIcon from "@/components/shared/TextIcon";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import { convert } from "@/utils/data";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RiArrowUpDownFill } from "react-icons/ri";

interface SortSelectorProps<T> {
  type: T;
  onChange?: (item: string) => void;
  defaultValue?: string;
}

const SortSelector = <T extends "anime" | "manga">(
  props: SortSelectorProps<T>
) => {
  const { onChange, defaultValue = "averageScore", type } = props;
  const [activeItem, setActiveItem] = useState(defaultValue);
  const { ANIME_SORTS, MANGA_SORTS } = useConstantTranslation();
  const { locale } = useRouter();

  const SORTS = useMemo(
    () => (type === "anime" ? ANIME_SORTS : MANGA_SORTS),
    [ANIME_SORTS, MANGA_SORTS, type]
  );
  const placeholder = useMemo(
    () =>
      convert(activeItem, type === "anime" ? "animeSort" : "mangaSort", {
        locale,
      }),
    [activeItem, locale, type]
  );

  const handleClick = useCallback(
    (item: string) => () => {
      setActiveItem(item);

      onChange?.(item);
    },
    [onChange]
  );

  useEffect(() => {
    if (placeholder) return;

    const fallbackValue = SORTS[0].value;

    setActiveItem(fallbackValue);

    onChange?.(fallbackValue);
  }, [SORTS, defaultValue, onChange, placeholder]);

  return (
    <Popup
      type="click"
      reference={
        <TextIcon
          className="cursor-pointer text-gray-300 text-sm"
          LeftIcon={RiArrowUpDownFill}
          iconClassName="w-5 h-5"
        >
          <p>{placeholder}</p>
        </TextIcon>
      }
      placement="bottom-start"
    >
      <div className="space-y-2">
        {SORTS.map((sort, index) => (
          <p
            key={index}
            className="cursor-pointer text-sm text-gray-300 hover:text-primary-300 transition duration-300"
            onClick={handleClick(sort.value)}
          >
            {sort.label}
          </p>
        ))}
      </div>
    </Popup>
  );
};

export default React.memo(SortSelector) as typeof SortSelector;

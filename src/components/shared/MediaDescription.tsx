import useDevice from "@/hooks/useDevice";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import React, { useCallback, useEffect, useRef } from "react";
import Description, { DescriptionProps } from "./Description";

interface MediaDescriptionProps extends DescriptionProps {
  containerClassName?: string;
}

const noop = () => {};

const MediaDescription: React.FC<MediaDescriptionProps> = ({
  description,
  className,
  containerClassName,
  ...props
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    React.useState(false);
  const { t } = useTranslation("common");
  const ref = useRef<HTMLDivElement>(null);
  const { isMobile } = useDevice();

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const isClamped = element.scrollHeight > element.clientHeight;

    if (!isClamped) {
      setIsDescriptionExpanded(true);
    }
  }, []);

  const handleClick = useCallback(() => {
    setIsDescriptionExpanded(true);
  }, []);

  return (
    <div className={classNames("group relative", containerClassName)}>
      <Description
        ref={ref}
        description={description || t("updating") + "..."}
        className={classNames(
          isDescriptionExpanded ? "line-clamp-none" : "line-clamp-6",
          className
        )}
        onClick={isMobile ? handleClick : noop}
        {...props}
      />

      {!isDescriptionExpanded && !isMobile && (
        <button
          onClick={handleClick}
          className="bg-gradient-to-t from-background-900 via-background-900/80 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 absolute bottom-0 w-full h-12 text-center"
        >
          {t("read_more")}
        </button>
      )}
    </div>
  );
};

export default MediaDescription;

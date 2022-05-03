import Button from "@/components/shared/Button";
import { useReadInfo } from "@/contexts/ReadContext";
import { useReadPanel } from "@/contexts/ReadPanelContext";
import { useReadSettings } from "@/contexts/ReadSettingsContext";
import useDevice from "@/hooks/useDevice";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import { useTranslation } from "next-i18next";

interface ButtonNavigatorProps {
  onLeft: () => void;
  onRight: () => void;
}

const ButtonNavigator: React.FC<ButtonNavigatorProps> = ({
  onLeft,
  onRight,
}) => {
  const { isMobile } = useDevice();
  const { images } = useReadInfo();
  const {
    state: { isSidebarOpen, activeImageIndex },
  } = useReadPanel();
  const { t } = useTranslation("manga_read");

  const { direction } = useReadSettings();

  return (
    <AnimatePresence initial={!isMobile}>
      {direction !== "vertical" && (!isMobile || isSidebarOpen) && (
        <motion.div
          animate={{ opacity: !isMobile ? 0 : 1 }}
          whileHover={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          className={classNames(
            "w-11/12 md:w-4/6 z-50 flex items-center justify-between bottom-5 rounded-md p-2 bg-background-800 absolute"
          )}
        >
          <Button
            secondary
            LeftIcon={HiOutlineArrowNarrowLeft}
            onClick={onLeft}
          >
            {isMobile ? null : direction === "ltr" ? (
              <p>{t("previous_image")}</p>
            ) : (
              <p>{t("next_image")}</p>
            )}
          </Button>

          <p>
            {activeImageIndex + 1} / {images?.length || 0}
          </p>

          <Button
            secondary
            RightIcon={HiOutlineArrowNarrowRight}
            onClick={onRight}
          >
            {isMobile ? null : direction === "ltr" ? (
              <p>{t("next_image")}</p>
            ) : (
              <p>{t("previous_image")}</p>
            )}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(ButtonNavigator);

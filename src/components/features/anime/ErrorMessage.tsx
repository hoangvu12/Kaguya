import Portal from "@/components/shared/Portal";
import { useTranslation } from "next-i18next";
import React from "react";

interface ErrorMessageProps {
  errorMessage: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errorMessage }) => {
  const { t } = useTranslation("anime_watch");

  return (
    <Portal selector=".netplayer-container">
      <div className="text-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 space-y-4">
        <p className="text-4xl font-semibold">｡゜(｀Д´)゜｡</p>
        <p className="text-xl">
          {t("error_message", {
            error: errorMessage,
          })}
        </p>

        <p className="text-lg">{t("error_fallback_suggest")}</p>
      </div>
    </Portal>
  );
};

export default React.memo(ErrorMessage);

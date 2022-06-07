import Button from "@/components/shared/Button";
import Portal from "@/components/shared/Portal";
import { useTranslation } from "next-i18next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { HiDownload } from "react-icons/hi";
import { toast } from "react-toastify";

const PROMPT_KEY = "pwa_install_prompt_asked";

const PWAInstallPrompt = () => {
  const deferredPrompt = useRef<any>();
  const { t } = useTranslation("pwa_install_prompt");
  const [showPrompt, setShowPrompt] = useState(false);
  const [installable, setInstallable] = useState(false);

  const handleClosePrompt = useCallback(() => {
    setShowPrompt(false);

    localStorage.setItem(PROMPT_KEY, "true");
  }, []);

  const handleOpenPrompt = useCallback(() => {
    setShowPrompt(true);
  }, []);

  const handleInstall = useCallback(async () => {
    deferredPrompt.current.prompt();

    handleClosePrompt();

    deferredPrompt.current = null;
  }, [handleClosePrompt]);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();

      deferredPrompt.current = e;

      setInstallable(true);

      if (localStorage.getItem(PROMPT_KEY) !== "true") {
        setShowPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      toast.info(t("app_installed"));
    };

    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [t]);

  return installable ? (
    <React.Fragment>
      <HiDownload className="w-6 h-6" onClick={handleOpenPrompt} />

      {showPrompt ? (
        <Portal>
          <div
            className="fixed inset-0 z-40 bg-black/70"
            onClick={handleClosePrompt}
          />

          <div className="fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-50 w-11/12 md:w-2/3 p-8 rounded-md bg-background-900">
            <h1 className="text-4xl font-bold mb-4">{t("prompt_heading")}</h1>
            <p className="mb-4">{t("prompt_description")}</p>
            <div className="flex items-center justify-end space-x-4">
              <Button
                onClick={handleClosePrompt}
                className="!bg-transparent hover:!bg-white/20 transition duration-300"
              >
                <p>{t("prompt_no")}</p>
              </Button>
              <Button onClick={handleInstall} primary>
                <p>{t("prompt_yes")}</p>
              </Button>
            </div>
          </div>
        </Portal>
      ) : null}
    </React.Fragment>
  ) : null;
};

export default React.memo(PWAInstallPrompt);

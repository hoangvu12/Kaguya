import CircleButton from "@/components/shared/CircleButton";
import { useSubscription } from "@/contexts/SubscriptionContext";
import useIsSubscribed from "@/hooks/useIsSubscribed";
import useSubscribe from "@/hooks/useSubscribe";
import useUnsubscribe from "@/hooks/useUnsubscribe";
import { Media } from "@/types/anilist";
import { useTranslation } from "next-i18next";
import React, { useCallback } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdNotificationsActive, MdNotificationsNone } from "react-icons/md";
import { toast } from "react-toastify";

interface NotificationButtonProps<T> {
  type: T;
  source: Media;
}

const NotificationButton = <T extends "anime" | "manga">(
  props: NotificationButtonProps<T>
) => {
  const { type, source } = props;
  const { data: isSubscribed, isLoading } = useIsSubscribed(type, source);
  const { subscription } = useSubscription();
  const subscribe = useSubscribe(type, source);
  const unsubscribe = useUnsubscribe(type, source);
  const { t } = useTranslation("notification");

  const handleSubscribe = useCallback(
    (type: "SUBSCRIBE" | "UNSUBSCRIBE") => async () => {
      if (type === "SUBSCRIBE") {
        if (!subscription) {
          toast.error(t("subscription_needed_msg"));

          return;
        }

        subscribe.mutate(null);
      } else if (type === "UNSUBSCRIBE") {
        unsubscribe.mutate(null);
      }
    },
    [subscribe, subscription, t, unsubscribe]
  );

  if (isLoading) {
    return (
      <CircleButton
        secondary
        iconClassName="w-6 h-6 animate-spin"
        LeftIcon={AiOutlineLoading3Quarters}
      />
    );
  }

  return !!isSubscribed ? (
    <CircleButton
      secondary
      iconClassName="w-6 h-6"
      LeftIcon={MdNotificationsActive}
      onClick={handleSubscribe("UNSUBSCRIBE")}
    />
  ) : (
    <CircleButton
      secondary
      iconClassName="w-6 h-6"
      LeftIcon={MdNotificationsNone}
      onClick={handleSubscribe("SUBSCRIBE")}
    />
  );
};

export default React.memo(NotificationButton) as typeof NotificationButton;

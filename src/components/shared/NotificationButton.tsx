import CircleButton from "@/components/shared/CircleButton";
import config from "@/config";
import { useSubscription } from "@/contexts/SubscriptionContext";
import useIsSubscribed from "@/hooks/useIsSubscribed";
import useSubscribe from "@/hooks/useSubscribe";
import useUnsubscribe from "@/hooks/useUnsubscribe";
import { Anime, Manga } from "@/types";
import React, { useCallback } from "react";
import { MdNotificationsActive, MdNotificationsNone } from "react-icons/md";

interface NotificationButtonProps<T> {
  type: T;
  source: T extends "anime" ? Anime : Manga;
}

const NotificationButton = <T extends "anime" | "manga">(
  props: NotificationButtonProps<T>
) => {
  const { type, source } = props;
  const { data: isSubscribed, isLoading } = useIsSubscribed(type, source);
  const { subscription, setSubscription } = useSubscription();
  const subscribe = useSubscribe(type, source);
  const unsubscribe = useUnsubscribe(type, source);

  const handleSubscribe = useCallback(
    (type: "SUBSCRIBE" | "UNSUBSCRIBE") => async () => {
      if (!subscription) {
        const registration = await navigator.serviceWorker.ready;

        const sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: config.webPushPublicKey,
        });

        setSubscription(sub);
      }

      if (type === "SUBSCRIBE") {
        subscribe.mutate(null);
      } else if (type === "UNSUBSCRIBE") {
        unsubscribe.mutate(null);
      }
    },
    [setSubscription, subscribe, subscription, unsubscribe]
  );

  if (isLoading) return null;

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

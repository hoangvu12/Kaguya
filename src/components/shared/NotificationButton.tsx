import CircleButton from "@/components/shared/CircleButton";
import { useSubscription } from "@/contexts/SubscriptionContext";
import useIsSubscribed from "@/hooks/useIsSubscribed";
import useSubscribe from "@/hooks/useSubscribe";
import useUnsubscribe from "@/hooks/useUnsubscribe";
import { Anime, Manga } from "@/types";
import React, { useCallback } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdNotificationsActive, MdNotificationsNone } from "react-icons/md";
import { toast } from "react-toastify";

interface NotificationButtonProps<T> {
  type: T;
  source: T extends "anime" ? Anime : Manga;
}

const NotificationButton = <T extends "anime" | "manga">(
  props: NotificationButtonProps<T>
) => {
  const { type, source } = props;
  const { data: isSubscribed, isLoading } = useIsSubscribed(type, source);
  const { subscription } = useSubscription();
  const subscribe = useSubscribe(type, source);
  const unsubscribe = useUnsubscribe(type, source);

  const handleSubscribe = useCallback(
    (type: "SUBSCRIBE" | "UNSUBSCRIBE") => async () => {
      if (type === "SUBSCRIBE") {
        if (!subscription) {
          toast.error("Bạn phải bật thông báo truoại trước khi đăng ký");

          return;
        }

        subscribe.mutate(null);
      } else if (type === "UNSUBSCRIBE") {
        unsubscribe.mutate(null);
      }
    },
    [subscribe, subscription, unsubscribe]
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

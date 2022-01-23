import CircleButton from "@/components/shared/CircleButton";
import { Anime, Manga } from "@/types";
import { getTitle } from "@/utils/data";
import React, { useCallback, useState } from "react";
import { MdNotificationsActive, MdNotificationsNone } from "react-icons/md";
import { toast } from "react-toastify";

interface NotificationButtonProps<T> {
  type: T;
  source: T extends "anime" ? Anime : Manga;
}

const NotificationButton = <T extends "anime" | "manga">(
  props: NotificationButtonProps<T>
) => {
  const { source } = props;
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = useCallback(() => {
    toast.success(
      <p>
        Đã {isSubscribed ? "tắt" : "bật"} thông báo <b>{getTitle(source)}</b>{" "}
      </p>
    );

    setIsSubscribed(!isSubscribed);
  }, [isSubscribed, source]);

  return isSubscribed ? (
    <CircleButton
      secondary
      iconClassName="w-6 h-6"
      LeftIcon={MdNotificationsActive}
      onClick={handleSubscribe}
    />
  ) : (
    <CircleButton
      secondary
      iconClassName="w-6 h-6"
      LeftIcon={MdNotificationsNone}
      onClick={handleSubscribe}
    />
  );
};

export default React.memo(NotificationButton) as typeof NotificationButton;

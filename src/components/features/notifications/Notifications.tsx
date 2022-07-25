import Loading from "@/components/shared/Loading";
import Popup from "@/components/shared/Popup";
import useNotifications from "@/hooks/useNotifications";
import useSeenNotifications from "@/hooks/useSeenNotifications";
import { useUser } from "@supabase/auth-helpers-react";
import React, { useMemo } from "react";
import { MdNotifications } from "react-icons/md";
import Notification from "./Notification";

const Notifications = () => {
  const { data: notifications, isLoading } = useNotifications();
  const { mutate: seenNotifcations } = useSeenNotifications();
  const { user } = useUser();

  const unreadCount = useMemo(
    () =>
      !notifications || !user?.id
        ? 0
        : notifications.reduce((total, notification) => {
            const notificationUser = notification.notificationUsers.find(
              (notificationUser) => notificationUser.userId === user.id
            );

            if (!notificationUser.isRead) {
              return total + 1;
            }

            return total;
          }, 0),
    [notifications, user?.id]
  );

  const handlePopupClick = () => {
    seenNotifcations(notifications);
  };

  return (
    <Popup
      onClick={handlePopupClick}
      type="click"
      placement="bottom"
      reference={
        <div className="relative">
          <MdNotifications className="w-6 h-6" />

          {unreadCount > 0 && (
            <div className="flex items-center justify-center absolute w-4 h-4 -top-1 -right-1 text-xs text-white font-semibold bg-primary-500 rounded-full">
              {unreadCount}
            </div>
          )}
        </div>
      }
      className="space-y-2 relative h-96 w-[30rem] overflow-y-scroll no-scrollbar bg-background-800"
    >
      {isLoading ? (
        <Loading className="w-6 h-6" />
      ) : (
        notifications?.map((notification) => (
          <Notification notification={notification} key={notification.id} />
        ))
      )}
    </Popup>
  );
};

export default Notifications;

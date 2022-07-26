import React, { useMemo } from "react";
import { Notification as NotificationType } from "@/types";
import Avatar from "@/components/shared/Avatar";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import Link from "next/link";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";

interface NotificationProps {
  notification: NotificationType;
}

const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const { NOTIFICATION_ENTITIES } = useConstantTranslation();
  const { locale } = useRouter();
  const { user } = useUser();

  const notificationEntity = useMemo(
    () => NOTIFICATION_ENTITIES[notification.entityType]?.(notification),
    [NOTIFICATION_ENTITIES, notification]
  );

  const notifcationUser = useMemo(
    () =>
      notification.notificationUsers.find(
        (notificationUser) => notificationUser.userId === user?.id
      ),
    [notification.notificationUsers, user?.id]
  );

  return (
    <Link href={notificationEntity.redirectUrl}>
      <a>
        <div className="flex items-center justify-between p-2 hover:bg-white/10 transition duration-300">
          <div className="rounded-md flex gap-2">
            <Avatar
              src={notification.sender?.user_metadata?.avatar_url}
              className="w-10 h-10 shrink-0"
            />

            <div className="space-y-1">
              <p>{notificationEntity.message}</p>
              <p className="text-sm text-gray-400">
                {dayjs(notification.created_at, { locale }).fromNow()}
              </p>
            </div>
          </div>

          {!notifcationUser?.isRead && (
            <div className="bg-primary-500 w-4 h-4 rounded-full"></div>
          )}
        </div>
      </a>
    </Link>
  );
};

export default Notification;

import Avatar from "@/components/shared/Avatar";
import { AdditionalUser } from "@/types";
import Link from "next/link";
import React from "react";

interface UserCardProps {
  user: AdditionalUser;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <Link href={`/users/${user.username}`}>
      <a>
        <div className="w-full px-3 py-2 bg-background-700 flex items-center gap-2">
          <Avatar src={user.avatarUrl} className="w-14 h-14 shrink-0" />

          <div className="overflow-hidden">
            <p className="line-clamp-1 text-lg font-bold">{user.name}</p>
            <p className="line-clamp-1 text-base text-gray-300">
              @{user.username}
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default UserCard;

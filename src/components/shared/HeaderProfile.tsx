import { useUser } from "@/contexts/AuthContext";
import React from "react";
import Popup from "@/components/shared/Popup";
import TextIcon from "@/components/shared/TextIcon";
import { HiOutlineLogout } from "react-icons/hi";
import Button from "@/components/shared/Button";
import supabase from "@/lib/supabase";
import Avatar from "@/components/shared/Avatar";
import useSyncUser from "@/hooks/useSyncUser";
import { MdOutlineManageAccounts } from "react-icons/md";
import { useRouter } from "next/router";
import Link from "next/link";

const roles = {
  user: "Người dùng",
  admin: "Admin",
};

const HeaderProfile = () => {
  const router = useRouter();
  const user = useUser();
  const { data: syncUser } = useSyncUser();

  if (!user) return null;

  return (
    <Popup
      type="click"
      placement="bottom-start"
      offset={[3.5, 10]}
      showArrow
      reference={<Avatar src={user.user_metadata.avatar_url} />}
    >
      <div className="flex items-center mb-8 space-x-2">
        <Avatar src={user.user_metadata.avatar_url} className="!w-14 !h-14" />

        <div>
          <p className="font-semibold">{user.user_metadata.name}</p>
          <p className="text-gray-300">
            {roles[syncUser?.auth_role || "user"]}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {syncUser?.auth_role === "admin" && (
          <Link href="/admin">
            <a>
              <Button className="w-full !bg-transparent hover:!bg-white/20">
                <TextIcon LeftIcon={MdOutlineManageAccounts}>
                  <p>Admin dashboard</p>
                </TextIcon>
              </Button>
            </a>
          </Link>
        )}

        <Button
          className="w-full !bg-transparent hover:!bg-white/20"
          onClick={supabase.auth.signOut}
        >
          <TextIcon LeftIcon={HiOutlineLogout}>
            <p>Đăng xuất</p>
          </TextIcon>
        </Button>
      </div>
    </Popup>
  );
};

export default React.memo(HeaderProfile);

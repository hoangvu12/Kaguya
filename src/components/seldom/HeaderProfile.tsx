import useUser from "@/hooks/useUser";
import React from "react";
import Image from "../shared/Image";
import Popup from "../shared/Popup";
import TextIcon from "../shared/TextIcon";
import { HiOutlineLogout } from "react-icons/hi";
import Button from "../shared/Button";
import supabase from "@/lib/supabase";

const HeaderProfile = () => {
  const user = useUser();

  if (!user) return null;

  return (
    <Popup
      type="click"
      placement="bottom-start"
      offset={[3.5, 10]}
      showArrow
      reference={
        <div className="w-10 h-10 rounded-full relative">
          <Image
            src={user.user_metadata.avatar_url}
            alt="header profile"
            layout="fill"
            className="rounded-full"
          />
        </div>
      }
    >
      <div className="flex items-center space-x-2 mb-8">
        <div className="relative w-14 h-14 rounded-full">
          <Image
            src={user.user_metadata.avatar_url}
            alt="header profile"
            layout="fill"
            className="rounded-full"
          />
        </div>

        <div>
          <p className="font-semibold">{user.user_metadata.name}</p>
          <p className="text-gray-300">Quản lí (sắp có)</p>
        </div>
      </div>

      <Button
        className="w-full !bg-transparent hover:!bg-white/20"
        onClick={() => supabase.auth.signOut()}
      >
        <TextIcon LeftIcon={HiOutlineLogout}>
          <p>Đăng xuất</p>
        </TextIcon>
      </Button>
    </Popup>
  );
};

export default HeaderProfile;

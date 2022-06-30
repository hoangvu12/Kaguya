import Avatar from "@/components/shared/Avatar";
import Button from "@/components/shared/Button";
import Popup from "@/components/shared/Popup";
import TextIcon from "@/components/shared/TextIcon";
import { useUser } from "@supabase/auth-helpers-react";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { useTranslation } from "next-i18next";
import React from "react";
import { HiOutlineLogout } from "react-icons/hi";
import Link from "next/link";
import { AiOutlineUpload } from "react-icons/ai";

const HeaderProfile = () => {
  const { user } = useUser();
  const { t } = useTranslation("header");

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
          <p className="text-gray-300 text-sm">{t("user")}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Link href="/upload">
          <a>
            <Button className="w-full" secondary>
              <TextIcon LeftIcon={AiOutlineUpload}>Upload</TextIcon>
            </Button>
          </a>
        </Link>

        <Button
          className="w-full !bg-transparent hover:!bg-white/20"
          onClick={() => {
            supabase.auth.signOut();
          }}
        >
          <TextIcon LeftIcon={HiOutlineLogout}>
            <p>{t("logout")}</p>
          </TextIcon>
        </Button>
      </div>
    </Popup>
  );
};

export default React.memo(HeaderProfile);

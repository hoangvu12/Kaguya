import React, { useEffect, useState } from "react";
import nookies from "nookies";
import CircleButton from "../shared/CircleButton";
import { AiOutlineClose } from "react-icons/ai";
import { useUser } from "@/contexts/AuthContext";
import Link from "next/link";
import { DISCORD_URL } from "@/constants";

const ANNOUNCEMENT_COOKIE = "kaguya_announcement-suggestion";
const EXPIRE_TIME = 60 * 60 * 24 * 30; // 30 days

const Announcement = () => {
  const [isShow, setIsShow] = useState(false);
  const user = useUser();

  const handleClose = () => {
    setIsShow(false);

    nookies.set(null, ANNOUNCEMENT_COOKIE, "1", {
      maxAge: EXPIRE_TIME,
      path: "/",
    });
  };

  useEffect(() => {
    const cookies = nookies.get(null);

    if (!cookies?.[ANNOUNCEMENT_COOKIE]) {
      setIsShow(true);
    }
  }, []);

  return isShow ? (
    <div className="text-center z-[9999] fixed w-full top-0 h-12 bg-background-500">
      <div className="relative w-full h-full flex justify-center items-center">
        <span>
          Have any suggestions? Join our{" "}
          <Link href={DISCORD_URL}>
            <a className="text-primary-500 hover:underline">
              <span>Discord</span>
            </a>
          </Link>{" "}
          and let us know!
        </span>

        <CircleButton
          secondary
          LeftIcon={AiOutlineClose}
          className="absolute right-0 top-1/2 -translate-y-1/2"
          onClick={handleClose}
        />
      </div>
    </div>
  ) : null;
};

export default Announcement;

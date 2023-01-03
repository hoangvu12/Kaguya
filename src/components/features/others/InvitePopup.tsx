import CircleButton from "@/components/shared/CircleButton";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import nookies from "nookies";
import Image from "@/components/shared/Image";
import { DISCORD_URL } from "@/constants";

const INVITE_COOKIE = "kaguya_discord_invite";

const NEVER_EXPIRE_TIME = 2147483647;

const InvitePopup = () => {
  const [isShow, setIsShow] = useState(true);

  const handleClose = () => {
    setIsShow(false);
  };

  useEffect(() => {
    const cookies = nookies.get(null);

    if (cookies?.[INVITE_COOKIE]) {
      setIsShow(false);

      return;
    }

    nookies.set(null, INVITE_COOKIE, "1", {
      maxAge: NEVER_EXPIRE_TIME,
      path: "/",
    });
  }, []);

  return isShow ? (
    <div className="fixed inset-0 z-[9999]">
      <div
        className="bg-black/60 absolute inset-0 z-40"
        onClick={handleClose}
      ></div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="w-[90vw] md:w-[40rem] md:min-h-[20rem] rounded-xl bg-background-700 p-4">
          <div className="flex gap-4">
            <div className="hidden md:block shrink-0 relative w-52 h-80 bg-background-700 rounded-full">
              <Image
                src="/discord_invite_hero.png"
                layout="fill"
                className="w-full h-full object-cover"
                unoptimized
              />

              <div className="bg-gradient-to-b from-transparent via-background-700/60 to-background-700 absolute bottom-0 h-12 w-full"></div>
              <div className="bg-gradient-to-r from-transparent via-background-700/60 to-background-700 absolute right-0 h-full w-12"></div>
            </div>

            <div className="flex flex-col justify-between p-4">
              <div>
                <h1 className="text-4xl font-bold mb-4">Don't miss out!</h1>
                <p className="text-lg font-medium mb-8">
                  Need help? <b>Join</b> our Discord server now to get your
                  problems done. We are waiting for you!
                </p>
              </div>
              <div className="w-full min-h-[5rem]">
                <a href={DISCORD_URL} target="_blank">
                  <img src="https://discordapp.com/api/guilds/906042713688928257/widget.png?style=banner2" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <CircleButton
          onClick={handleClose}
          className="absolute top-2 right-2"
          secondary
          iconClassName="w-6 h-6"
          LeftIcon={AiOutlineClose}
        />
      </div>
    </div>
  ) : null;
};

export default InvitePopup;

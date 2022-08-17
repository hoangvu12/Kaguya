import Head from "@/components/shared/Head";
import Logo from "@/components/shared/Logo";
import NavItem from "@/components/shared/NavItem";
import useDevice from "@/hooks/useDevice";
import classNames from "classnames";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";
import {
  AiOutlineHome,
  AiOutlinePlus,
  AiOutlineVideoCameraAdd,
} from "react-icons/ai";
import { BiImageAdd, BiLogOutCircle } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import Button from "../shared/Button";
import Popup from "../shared/Popup";

const routes = [
  {
    title: "Trang chủ",
    href: "/upload",
    icon: AiOutlineHome,
  },
  {
    title: "Anime",
    href: "/upload/anime",
    icon: AiOutlineVideoCameraAdd,
  },
  {
    title: "Manga",
    href: "/upload/manga",
    icon: BiImageAdd,
  },
];

const variants: Variants = {
  animate: {
    x: 0,
  },
  initial: {
    x: "-100%",
  },
};

const UploadLayout: React.FC = ({ children }) => {
  const { isMobile } = useDevice();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full min-h-screen flex justify-end">
      <Head title="Upload - Kaguya" />

      {isMobile && isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      <AnimatePresence initial={isMobile}>
        <motion.div
          variants={variants}
          transition={{ ease: "linear" }}
          animate={!isMobile || isMenuOpen ? "animate" : ""}
          initial="initial"
          className="h-full w-[70vw] md:w-[20vw] fixed top-0 left-0 bottom-0 z-50 flex flex-col justify-between bg-background-900 p-4"
        >
          <div>
            <Logo />

            <ul>
              <Popup
                type="click"
                placement="bottom-end"
                showArrow
                reference={
                  <Button
                    className="w-full mb-4"
                    iconClassName="w-8 h-8"
                    primary
                    LeftIcon={AiOutlinePlus}
                  >
                    Đăng tải
                  </Button>
                }
              >
                <div className="space-y-1">
                  <Link href="/upload/anime/create">
                    <a>
                      <Button secondary>Đăng anime</Button>
                    </a>
                  </Link>
                  <Link href="/upload/manga/create">
                    <a>
                      <Button secondary>Đăng manga</Button>
                    </a>
                  </Link>
                </div>
              </Popup>

              {routes.map((route) => (
                <NavItem
                  className="block mb-2"
                  href={route.href}
                  key={route.href}
                >
                  {({ isActive }) => (
                    <li
                      className={classNames(
                        "flex items-center space-x-2 transition duration-300 font-semibold px-3 py-2 cursor-pointer rounded-md",
                        isActive ? "bg-white/20" : "hover:bg-white/20"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <route.icon className="w-6 h-6" />

                      <p>{route.title}</p>
                    </li>
                  )}
                </NavItem>
              ))}
            </ul>
          </div>

          <Link href="/">
            <a className="w-full">
              <li
                className={classNames(
                  "flex items-center space-x-2 hover:bg-white/20 transition duration-300 font-semibold px-3 py-2 cursor-pointer rounded-md"
                )}
              >
                <BiLogOutCircle className="w-6 h-6" />

                <p>Quay về trang chủ</p>
              </li>
            </a>
          </Link>
        </motion.div>
      </AnimatePresence>

      <div className="w-full md:w-4/5 pt-16 pb-4 md:py-12">
        {isMobile && (
          <GiHamburgerMenu
            className="absolute top-4 left-4 w-8 h-8"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
          />
        )}

        <div className="relative w-full h-full">{children}</div>
      </div>
    </div>
  );
};

export default UploadLayout;

import { useUser } from "@/contexts/AuthContext";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import HeaderProfile from "@/components/shared/HeaderProfile";
import NavItem from "@/components/shared/NavItem";
import Button from "@/components/shared/Button";
import Drawer, { DrawerRef } from "@/components/shared/Drawer";
import Logo from "@/components/shared/Logo";

const routes = [
  {
    title: "Anime",
    href: "/",
  },
  {
    title: "Manga",
    href: "/manga",
  },
];

const Header = () => {
  const [isTop, setIsTop] = useState(false);
  const drawerRef = useRef<DrawerRef>();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY > 0);
    };

    document.addEventListener("scroll", handleScroll);
  }, []);

  const searchUrl = router.asPath.includes("manga")
    ? "/browse?type=manga"
    : "/browse?type=anime";

  return (
    <header
      className={classNames(
        "px-4 md:px-12 flex items-center h-16 fixed top w-full z-50 transition duration-500",
        isTop && "bg-background"
      )}
    >
      <Drawer
        ref={drawerRef}
        containerClassName="sm:hidden mr-4"
        className="py-8 space-y-2"
        button={<GiHamburgerMenu className="w-6 h-6" />}
      >
        <Logo className="border-b-2 border-gray-500" />

        {routes.map((route) => (
          <div onClick={drawerRef.current?.close} key={route.href}>
            <NavItem className="block" href={route.href}>
              {({ isActive }) => (
                <p
                  className={classNames(
                    "pl-4 border-l-4 font-semibold text-2xl",
                    isActive
                      ? "border-primary-500 text-white"
                      : "border-background-900 text-typography-secondary"
                  )}
                >
                  {route.title}
                </p>
              )}
            </NavItem>
          </div>
        ))}
      </Drawer>

      <div className="relative h-2/3 w-10 mr-8">
        <NavItem href="/">
          {() => (
            <Image
              src="/logo.png"
              layout="fill"
              objectFit="contain"
              alt="logo"
            />
          )}
        </NavItem>
      </div>

      <div className="hidden sm:flex items-center space-x-6 font-semibold text-typography-secondary">
        {routes.map((route) => (
          <NavItem href={route.href} key={route.href}>
            {({ isActive }) => (
              <p
                className={classNames(
                  "hover:text-white transition duration-300",
                  isActive && "text-primary-500"
                )}
              >
                {route.title}
              </p>
            )}
          </NavItem>
        ))}
      </div>

      <div className="flex items-center space-x-4 ml-auto">
        <NavItem href={searchUrl}>
          {({ isActive }) => (
            <AiOutlineSearch
              className={classNames(
                "w-7 h-7 font-semibold hover:text-primary-500 transition duration-300",
                isActive && "text-primary-500"
              )}
            />
          )}
        </NavItem>

        {user ? (
          <HeaderProfile />
        ) : (
          <div className="flex items-center space-x-2">
            <Button primary onClick={() => router.push("/login")}>
              <p>Đăng nhập</p>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

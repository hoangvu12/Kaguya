import classNames from "classnames";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import NavItem from "../seldom/NavItem";
import Drawer from "../shared/Drawer";

const routes = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Phim mới",
    href: "/latest",
  },
  {
    title: "Xu hướng",
    href: "/trending",
  },
  {
    title: "Nổi bật",
    href: "/popular",
  },
];

const Header = () => {
  const [isTop, setIsTop] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY > 0);
    };

    document.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={classNames(
        "px-4 md:px-12 flex items-center h-16 fixed top w-full z-50 transition duration-500",
        isTop && "bg-background"
      )}
    >
      <Drawer
        containerClassName="sm:hidden mr-4"
        className="py-8 space-y-2"
        button={<GiHamburgerMenu className="w-6 h-6" />}
      >
        <div className="relative mx-auto h-24 w-20 border-b-2 border-gray-500 !mb-8">
          <Image src="/logo.png" layout="fill" objectFit="contain" alt="logo" />
        </div>

        {routes.map((route) => (
          <NavItem className="block" href={route.href} key={route.href}>
            {({ isActive }) => (
              <p
                className={classNames(
                  "pl-4 border-l-4 font-semibold text-2xl transition duration-300",
                  isActive
                    ? "border-primary-500 text-white"
                    : "border-background-900 text-typography-secondary"
                )}
              >
                {route.title}
              </p>
            )}
          </NavItem>
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
                  "transition duration-300",
                  isActive && "text-primary-500"
                )}
              >
                {route.title}
              </p>
            )}
          </NavItem>
        ))}
      </div>
    </header>
  );
};

export default Header;

import classNames from "classnames";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import NavItem from "../seldom/NavItem";

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

  const isActiveRoute = (route: string) => router.route === route;

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY > 0);
    };

    document.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={classNames(
        "px-12 space-x-8 flex items-center h-16 fixed top w-full z-50 transition duration-500",
        isTop && "bg-background"
      )}
    >
      <div className="relative h-2/3 w-10">
        <Image src="/logo.png" layout="fill" objectFit="contain" />
      </div>

      <div className="flex items-center space-x-6 font-semibold text-typography-secondary">
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

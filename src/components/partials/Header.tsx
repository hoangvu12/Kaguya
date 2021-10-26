import classNames from "classnames";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const Header = () => {
  const [isTop, setIsTop] = useState(false);

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
        <a href="" className="text-primary-500 transition duration-300">
          Trang chủ
        </a>
        <a href="" className="hover:text-gray-200 transition duration-300">
          Phim mới
        </a>
        <a href="" className="hover:text-gray-200 transition duration-300">
          Xu hướng
        </a>
        <a href="" className="hover:text-gray-200 transition duration-300">
          Nổi bật
        </a>
      </div>
    </header>
  );
};

export default Header;

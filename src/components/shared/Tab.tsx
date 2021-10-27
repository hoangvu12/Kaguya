import classNames from "classnames";
import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import { UrlObject } from "url";

interface TabProps {
  className?: string;
}

const Tab: React.FC<TabProps> = ({ children, className }) => {
  return (
    <div className={classNames("flex items-center", className)}>{children}</div>
  );
};

interface TabItemProps {
  className?: string;
  active?: boolean;
  href: string | UrlObject;
}

export const TabItem: React.FC<TabItemProps> = ({
  className,
  children,
  active,
  href,
}) => {
  return (
    <Link scroll={false} href={href}>
      <a
        className={classNames(
          "relative flex items-center justify-center px-4 py-2 font-medium",
          active
            ? "text-primary-500"
            : "text-gray-400 hover:bg-gray-600/20 transition duration-300",
          className
        )}
      >
        {children}

        {active && (
          <motion.div
            animate
            layoutId="tab-underline"
            className={classNames(
              "h-0.5 w-full absolute bottom-0 bg-primary-500"
            )}
          ></motion.div>
        )}
      </a>
    </Link>
  );
};

export default Tab;

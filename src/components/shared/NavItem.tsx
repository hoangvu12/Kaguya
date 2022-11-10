import { useRouter } from "next/dist/client/router";
import { LinkProps } from "next/link";
import React, { useMemo } from "react";
import Link from "./Link";

interface NavItemProps extends LinkProps {
  children({ isActive }: { isActive: boolean }): React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ onClick, ...props }) => {
  const router = useRouter();
  const isActive = useMemo(
    () => router.route === props.href,
    [props.href, router.route]
  );

  return (
    <Link {...props}>
      <a className={props.className} onClick={onClick}>
        {props.children({ isActive })}
      </a>
    </Link>
  );
};

export default React.memo(NavItem);

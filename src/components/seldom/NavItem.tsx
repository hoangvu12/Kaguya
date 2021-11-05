import { useRouter } from "next/dist/client/router";
import Link, { LinkProps } from "next/link";
import React from "react";

interface NavItemProps extends LinkProps {
  children({ isActive: boolean }): React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ onClick, ...props }) => {
  const router = useRouter();
  const isActive = router.route === props.href;

  return (
    <Link {...props}>
      <a className={props.className} onClick={onClick}>
        {props.children({ isActive })}
      </a>
    </Link>
  );
};

export default NavItem;

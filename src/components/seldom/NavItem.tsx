import { useRouter } from "next/dist/client/router";
import Link, { LinkProps } from "next/link";
import React from "react";

interface NavItemProps extends LinkProps {
  children({ isActive: boolean }): React.ReactNode;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = (props) => {
  const router = useRouter();
  const isActive = router.route === props.href;

  return (
    <Link {...props}>
      <a className={props.className}>{props.children({ isActive })}</a>
    </Link>
  );
};

export default NavItem;

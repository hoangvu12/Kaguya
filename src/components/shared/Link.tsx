import React from "react";
import NextLink, { LinkProps } from "next/link";

interface CustomLinkProps extends LinkProps {
  disabled?: boolean;
}

const Link: React.FC<CustomLinkProps> = ({ disabled, ...props }) => {
  return disabled ? (
    <React.Fragment>{props.children}</React.Fragment>
  ) : (
    <NextLink prefetch={false} {...props}>
      {props.children}
    </NextLink>
  );
};

export default React.memo(Link) as typeof Link;

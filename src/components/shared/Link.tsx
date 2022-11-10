import React from "react";
import NextLink, { LinkProps } from "next/link";

const Link: React.FC<LinkProps> = (props) => {
  return (
    <NextLink prefetch={false} {...props}>
      {props.children}
    </NextLink>
  );
};

export default React.memo(Link) as typeof Link;

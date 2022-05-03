import React from "react";
import Link, { LinkProps } from "next/link";

// This component is made to be used in Trans component
// See more: https://github.com/i18next/react-i18next/issues/1090
const TransLink: React.FC<LinkProps & React.HTMLAttributes<HTMLAnchorElement>> =
  ({
    href,
    as,
    replace,
    scroll,
    shallow,
    passHref,
    prefetch,
    locale,
    ...props
  }) => {
    return (
      <Link
        href={href}
        as={as}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref={passHref}
        prefetch={prefetch}
        locale={locale}
      >
        <a {...props}>{props.children}</a>
      </Link>
    );
  };

export default TransLink;

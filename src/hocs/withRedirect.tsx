import { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { UrlObject } from "url";

interface TransitionOptions {
  shallow?: boolean;
  locale?: string | false;
  scroll?: boolean;
}

interface ReplaceParams {
  url: Url;
  as?: Url;
  options?: TransitionOptions;
}

type Url = UrlObject | string;

const withRedirect = <K,>(
  WrappedComponent: NextPage<K>,
  getRedirect: (router: NextRouter, props: K) => ReplaceParams
) => {
  const WithRedirectComponent: NextPage<K> = (props) => {
    const router = useRouter();
    const redirect = useMemo(() => getRedirect(router, props), [props, router]);

    useEffect(() => {
      if (!redirect) return;

      const { url, as, options } = redirect;

      router.replace(url, as, options);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <WrappedComponent {...props} />;
  };

  WithRedirectComponent.getInitialProps = WrappedComponent.getInitialProps;

  return WithRedirectComponent;
};

export default withRedirect;

import { useUser } from "@/contexts/AuthContext";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
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

const withAuthRedirect = <K,>(
  WrappedComponent: NextPage<K>,
  redirect?: ReplaceParams
) => {
  const WithAuthRedirectComponent: NextPage<K> = (props) => {
    const router = useRouter();
    const user = useUser();

    useEffect(() => {
      if (!redirect) return;
      if (user) return;

      const { url, as, options } = redirect;

      router.replace(url, as, options);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <WrappedComponent {...props} />;
  };

  WithAuthRedirectComponent.getInitialProps = WrappedComponent.getInitialProps;

  return WithAuthRedirectComponent;
};

export default withAuthRedirect;

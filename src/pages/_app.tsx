import BaseLayout from "@/components/layouts/BaseLayout";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { AppProps } from "next/app";
import Router, { useRouter } from "next/router";
import NProgress from "nprogress";
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { GA_TRACKING_ID, pageview } from "@/lib/gtag";
import Script from "next/script";

import "@/styles/index.css";

Router.events.on("routeChangeStart", NProgress.start);
Router.events.on("routeChangeComplete", NProgress.done);
Router.events.on("routeChangeError", NProgress.done);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

const isProduction = process.env.NODE_ENV === "production";

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isProduction) return;

    const handleRouteChange = (url: string) => {
      pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const getLayout =
    // @ts-ignore
    Component.getLayout || ((page) => <BaseLayout>{page}</BaseLayout>);

  return (
    <React.Fragment>
      {isProduction && (
        <React.Fragment>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />

          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </React.Fragment>
      )}

      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          {getLayout(<Component {...pageProps} />)}
        </AuthContextProvider>

        {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
      </QueryClientProvider>
    </React.Fragment>
  );
}

export default App;

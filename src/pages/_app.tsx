import BaseLayout from "@/components/layouts/BaseLayout";
import { SubscriptionContextProvider } from "@/contexts/SubscriptionContext";
import { GA_TRACKING_ID, pageview } from "@/lib/gtag";
import "@/styles/index.css";
import { appWithTranslation } from "next-i18next";
import nextI18nextConfig from "next-i18next.config";
import { AppProps } from "next/app";
import Router from "next/router";
import Script from "next/script";
import NProgress from "nprogress";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import * as Sentry from "@sentry/nextjs";
import { ErrorBoundary } from "react-error-boundary";
import { AppErrorFallback } from "@/components/shared/AppErrorFallback";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { UserProvider } from "@supabase/auth-helpers-react";
import GlobalPlayerContextProvider from "@/contexts/GlobalPlayerContext";
import AuthContext, { AuthContextProvider } from "@/contexts/AuthContext";

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

interface WorkaroundAppProps extends AppProps {
  err: any;
}

function App({ Component, pageProps, router, err }: WorkaroundAppProps) {
  const [errorInfo, setErrorInfo] = useState<React.ErrorInfo>(null);

  useEffect(() => {
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
      {/* A placeholder to integrate MAL-Sync (https://github.com/MALSync/MALSync)*/}
      <script id="syncData" type="application/json"></script>

      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
        `}
      </Script>

      <Script id="popunder" strategy="afterInteractive">
        {`
          function Set_Cookie(a, b, c, e, f, g) {
            var d = new Date();
            d.setTime(d.getTime());
            d = new Date(d.getTime() + c);
            document.cookie =
              a +
              "=" +
              escape(b) +
              (c ? ";expires=" + d.toGMTString() : "") +
              (e ? ";path=" + e : "") +
              (f ? ";domain=" + f : "") +
              (g ? ";secure" : "");
          }
          
          function Get_Cookie(a) {
            var b = document.cookie.indexOf(a + "="),
              c = b + a.length + 1;
            if ((!b && a != document.cookie.substring(0, a.length)) || -1 == b)
              return null;
            a = document.cookie.indexOf(";", c);
            -1 == a && (a = document.cookie.length);
            return unescape(document.cookie.substring(c, a));
          }
          
          function Delete_Cookie(a, b, c) {
            Get_Cookie(a) &&
              (document.cookie =
                a +
                "=" +
                (b ? ";path=" + b : "") +
                (c ? ";domain=" + c : "") +
                ";expires=Mon, 11-November-2020 00:00:01 GMT");
          }
          
          function popunder() {
            if (Get_Cookie("cucre") || Get_Cookie("sb-access-token")) return;

            Set_Cookie("cucre", "cucre Popunder", "1", "/", "", "")
            
            const pop = window.open(
              "https://bg4nxu2u5t.com/ERT/ERT.php?c=1944171",
              "windowcucre"
            );

            pop.blur();

            window.focus()
          }
          
          function addEvent(a, b, c) {
            a.attachEvent
              ? a.attachEvent("on" + b, c)
              : a.addEventListener
              ? a.addEventListener(b, c, !0)
              : (a["on" + b] = c);
          }
          
          addEvent(window, "load", function () {
            addEvent(document.body, "click", function () {
              popunder();
            });
          });        
        `}
      </Script>

      <Script
        strategy="afterInteractive"
        data-cfasync="false"
        type="text/javascript"
        src="https://ssqyuvavse.com/lv/esnk/1944246/code.js"
        async
        id="__clb-1944246"
      />

      <Script
        strategy="afterInteractive"
        data-cfasync="false"
        type="text/javascript"
        src="https://ssqyuvavse.com/lv/esnk/1944247/code.js"
        async
        id="__clb-1944247"
      />

      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <SubscriptionContextProvider>
            <GlobalPlayerContextProvider>
              <ErrorBoundary
                onError={(error, info) => {
                  if (process.env.NODE_ENV === "production") {
                    Sentry.captureException(error);
                  }
                  setErrorInfo(info);
                }}
                fallbackRender={(fallbackProps) => {
                  return (
                    <AppErrorFallback
                      {...fallbackProps}
                      errorInfo={errorInfo}
                    />
                  );
                }}
              >
                {getLayout(<Component {...pageProps} err={err} />)}
              </ErrorBoundary>
            </GlobalPlayerContextProvider>
          </SubscriptionContextProvider>
        </AuthContextProvider>

        {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
      </QueryClientProvider>
    </React.Fragment>
  );
}

export default appWithTranslation(App, nextI18nextConfig);

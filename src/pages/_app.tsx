import { AppProps } from "next/app";
import React from "react";
import Router from "next/router";
import NProgress from "nprogress";

import BaseLayout from "@/components/layouts/BaseLayout";
import Head from "@/components/shared/Head";

import "@/styles/index.css";
import { QueryClient, QueryClientProvider } from "react-query";

Router.events.on("routeChangeStart", NProgress.start);
Router.events.on("routeChangeComplete", NProgress.done);
Router.events.on("routeChangeError", NProgress.done);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

function App({ Component, pageProps }: AppProps) {
  const getLayout =
    // @ts-ignore
    Component.getLayout || ((page) => <BaseLayout>{page}</BaseLayout>);

  return (
    <React.Fragment>
      <Head />

      <QueryClientProvider client={queryClient}>
        {getLayout(<Component {...pageProps} />)}
      </QueryClientProvider>
    </React.Fragment>
  );
}

export default App;

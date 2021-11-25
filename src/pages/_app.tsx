import BaseLayout from "@/components/layouts/BaseLayout";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { AppProps } from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

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

function App({ Component, pageProps }: AppProps) {
  const getLayout =
    // @ts-ignore
    Component.getLayout || ((page) => <BaseLayout>{page}</BaseLayout>);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        {getLayout(<Component {...pageProps} />)}
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;

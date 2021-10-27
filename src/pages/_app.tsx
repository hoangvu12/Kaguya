import { AppProps } from "next/app";
import React from "react";
import Router from "next/router";
import NProgress from "nprogress";

import BaseLayout from "@/components/layouts/BaseLayout";
import Head from "@/components/shared/Head";

import "@/styles/index.css";

Router.events.on("routeChangeStart", NProgress.start);
Router.events.on("routeChangeComplete", NProgress.done);
Router.events.on("routeChangeError", NProgress.done);

function App({ Component, pageProps }: AppProps) {
  const getLayout =
    // @ts-ignore
    Component.getLayout || ((page) => <BaseLayout>{page}</BaseLayout>);

  return (
    <React.Fragment>
      <Head />

      {getLayout(<Component {...pageProps} />)}
    </React.Fragment>
  );
}

export default App;

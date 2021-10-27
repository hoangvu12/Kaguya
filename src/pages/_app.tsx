import Head from "@/components/shared/Head";
import { AnimateSharedLayout } from "framer-motion";
import { AppProps } from "next/app";
import React from "react";
import BaseLayout from "../components/layouts/BaseLayout";
import "../styles/index.css";

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

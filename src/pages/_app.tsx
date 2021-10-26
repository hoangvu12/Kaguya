import React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import "../styles/index.css";
import BaseLayout from "../components/layouts/BaseLayout";

function App({ Component, pageProps }: AppProps) {
  const getLayout =
    // @ts-ignore
    Component.getLayout || ((page) => <BaseLayout>{page}</BaseLayout>);

  return (
    <React.Fragment>
      <Head>
        <title>NextJS TailwindCSS TypeScript Starter</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </React.Fragment>
  );
}

export default App;

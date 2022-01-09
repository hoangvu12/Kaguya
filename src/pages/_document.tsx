import Document, { Html, Head, Main, NextScript } from "next/document";
// eslint-disable-next-line @next/next/no-script-in-document
import Script from "next/script";

class MyDocument extends Document {
  public render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

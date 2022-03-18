import { GA_TRACKING_ID } from "@/lib/gtag";
import Document, { Html, Head, Main, NextScript } from "next/document";
// eslint-disable-next-line @next/next/no-script-in-document

class MyDocument extends Document {
  public render() {
    return (
      <Html>
        <Head>
          <meta
            httpEquiv="Content-Security-Policy"
            content="upgrade-insecure-requests"
          />

          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

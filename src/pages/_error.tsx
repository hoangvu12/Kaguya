import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Section from "@/components/shared/Section";
import * as Sentry from "@sentry/nextjs";
import { NextPage } from "next";
import { Trans, useTranslation } from "next-i18next";
import NextErrorComponent, { ErrorProps } from "next/error";
import Link from "next/link";

interface CustomErrorProps extends ErrorProps {
  hasGetInitialPropsRun: boolean;
  err?: Error & {
    statusCode: number;
  };
}

const isDev = process.env.NODE_ENV === 'development'

// @ts-ignore
const ErrorPage: NextPage<CustomErrorProps, CustomErrorProps> = ({
  statusCode,
  hasGetInitialPropsRun,
  err,
}) => {
  const { t } = useTranslation("_error_page");

  if (!hasGetInitialPropsRun && err && !isDev) {
    // getInitialProps is not called in case of
    // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
    Sentry.captureException(err);
    // Flushing is not required in this case as it only happens on the client
  }

  return (
    <div className="relative w-full min-h-screen flex items-center">
      <Head title={`${t("error_title", { statusCode })} - Kaguya`} />

      <div className="fixed z-0 w-full h-full flex items-center justify-center">
        <h1 className="font-bold text-[30vw] text-gray-500">{statusCode}</h1>

        <div className="absolute inset-0 bg-black/90 w-full h-full"></div>
      </div>

      <Section className="relative z-10 flex flex-col items-center w-full h-full text-center ">
        <div className="mb-4 text-gray-300">
          <span className="text-lg">
            <Trans i18nKey="_error_page:error_welcome" statusCode={statusCode}>
              Chào mừng đến với{" "}
              <span className="text-red-300">chiều không gian 404</span>
            </Trans>
          </span>
        </div>

        <p className="text-4xl font-semibold">
          {t("error_heading", { statusCode })}
        </p>

        <p className="text-2xl text-gray-200 mt-4">{t("error_description")}</p>

        <p>
          <i>Error: {err}</i>
        </p>

        <Link href="/">
          <a>
            <Button primary outline className="mt-8">
              <p className="text-lg">{t("error_goback")}</p>
            </Button>
          </a>
        </Link>
      </Section>
    </div>
  );
};

// @ts-ignore
ErrorPage.getLayout = (page) => page;

// @ts-ignore
ErrorPage.getInitialProps = async (context) => {
  const errorInitialProps = await NextErrorComponent.getInitialProps(context);

  // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run
  const errorProps: CustomErrorProps = {
    ...errorInitialProps,
    hasGetInitialPropsRun: true,
  };

  const { res, err, asPath } = context;

  // Returning early because we don't want to log 404 errors to Sentry.
  if (res?.statusCode === 404) {
    return errorProps;
  }

  // Running on the server, the response object (`res`) is available.
  //
  // Next.js will pass an err on the server if a page's data fetching methods
  // threw or returned a Promise that rejected
  //
  // Running on the client (browser), Next.js will provide an err if:
  //
  //  - a page's `getInitialProps` threw or returned a Promise that rejected
  //  - an exception was thrown somewhere in the React lifecycle (render,
  //    componentDidMount, etc) that was caught by Next.js's React Error
  //    Boundary. Read more about what types of exceptions are caught by Error
  //    Boundaries: https://reactjs.org/docs/error-boundaries.html

  if (err && !isDev) {
    Sentry.captureException(err);

    // Flushing before returning is necessary if deploying to Vercel, see
    // https://vercel.com/docs/platform/limits#streaming-responses
    await Sentry.flush(2000);

    return errorProps;
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug introduced in Next.js, so record it in Sentry
  Sentry.captureException(
    new Error(`_error.js getInitialProps missing data at path: ${asPath}`)
  );
  await Sentry.flush(2000);

  return errorProps;
};

export default ErrorPage;

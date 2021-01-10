import type { AppProps /*, AppContext */ } from "next/app";

import "../styles/globals.treat";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

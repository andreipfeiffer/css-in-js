import type { AppProps /*, AppContext */ } from "next/app";

// @todo this didn't work: https://github.com/callstack/linaria/blob/master/docs/BASICS.md#adding-global-styles

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

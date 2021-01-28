import type { AppProps /*, AppContext */ } from "next/app";

import React from "react";
import { prefix } from "goober-autoprefixer";
import { setup } from "goober";
import { createGlobalStyles } from "goober/global";

// goober's needs to know how to render the `styled` nodes.
// So to let it know, we run the `setup` function with the
// `createElement` function and prefixer function.
setup(React.createElement, prefix);

export function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <GlobalStyles />
    </>
  );
}

const GlobalStyles = createGlobalStyles`
  html,
  body {
    padding: 0;
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  html,
  body,
  button,
  input {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-size: 16px;
  }

  a:link,
  a:visited {
    color: dodgerblue;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }

  * {
    box-sizing: border-box;
  }
`;

export default MyApp;

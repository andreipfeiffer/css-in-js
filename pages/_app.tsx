import type { AppProps /*, AppContext */ } from "next/app";
import { css, global } from "../stitches.config";

function MyApp({ Component, pageProps }: AppProps) {
	globalStyles()
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

const globalStyles = global({
  "body, html": {
    padding: 0,
    margin: 0,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  "html, body, button, input": {
    fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`,
    fontSize: "16px",
  },

  "a:link, a:visited": {
    color: "dodgerblue",
    textDecoration: "none",
  },

  "a:hover": {
    textDecoration: "underline",
  },

  "*": {
    boxSizing: "border-box",
  },
});

export default MyApp;

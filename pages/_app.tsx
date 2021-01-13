import type { AppProps /*, AppContext */ } from "next/app";
import FelaProvider from "../FelaProvider";

function MyApp({ Component, pageProps, renderer }: AppProps) {
  renderer?.renderStatic(globals);

  return (
    <FelaProvider renderer={renderer}>
      <Component {...pageProps} />
    </FelaProvider>
  );
}

const globals = `
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

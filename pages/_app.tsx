import App from "next/app";
import type { AppProps /*, AppContext */ } from "next/app";

export class MyApp extends App {
  componentDidMount() {
    const style = document.getElementById("server-side-styles");

    if (style) {
      style?.parentNode?.removeChild(style);
    }
  }
}

/*
const global_styles = css.global`
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
*/
export default MyApp;

import App from "next/app";
import injectSheet from "react-jss";

export class MyApp extends App {
  componentDidMount() {
    const style = document.getElementById("server-side-styles");

    if (style) {
      style?.parentNode?.removeChild(style);
    }
  }
}

const style = {
  "@global": {
    ["html, body"]: {
      padding: 0,
      margin: 0,
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    },
    ["html, body, button, input"]: {
      fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`,
      fontSize: "16px",
    },
    ["a:link, a:visited"]: {
      color: "dodgerblue",
      textDecoration: "none",
    },
    ["a:hover"]: {
      textDecoration: "underline",
    },
    ["*"]: {
      boxSizing: "border-box",
    },
  },
};

export default injectSheet(style)(MyApp);

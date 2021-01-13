import App from "next/app";

import "../styles/globals.css";

export class MyApp extends App {
  componentDidMount() {
    const style = document.getElementById("server-side-styles");

    if (style) {
      style?.parentNode?.removeChild(style);
    }
  }
}

export default MyApp;

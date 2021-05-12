import { globalStyle } from "@vanilla-extract/css";

globalStyle("html, body", {
  padding: 0,
  margin: 0,
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
});

globalStyle("html, body, button, input", {
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`,
  fontSize: "16px",
});

globalStyle("a:link, a:visited", {
  color: "dodgerblue",
  textDecoration: "none",
});

globalStyle("a:hover", {
  textDecoration: "underline",
});

globalStyle("*", {
  boxSizing: "border-box",
});

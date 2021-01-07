import css from "styled-jsx/css";
import { Button } from "../components/button";

export default function Home() {
  return (
    <main>
      <style global jsx>
        {global_styles}
      </style>

      <Button>Default color</Button>
      <Button color="yellow">Yellow color</Button>
      <Button color="green">Green color</Button>
    </main>
  );
}

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
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }
`;

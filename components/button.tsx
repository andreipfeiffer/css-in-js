import css from "styled-jsx/css";

enum Color {
  grey = "#cccccc",
  blue = "dodgerblue",
  yellow = "#e3b307",
  green = "#57b004",
  red = "#db2e02",
}

type Props = {
  children: string;
  color?: keyof typeof Color;
  onClick?(): void;
};

export function Button(props: Props) {
  const { children, color = "grey", onClick } = props;

  return (
    <button onClick={onClick}>
      <span>{children}</span>

      <style jsx>{button}</style>
      <style jsx>
        {`
          // dynamic styles, need to be split from static styles
          button {
            color: ${Color[color]};
          }
        `}
      </style>
    </button>
  );
}

const button = css`
  button {
    border: 0;
    height: 3em;
    padding: 0 2em;
    border-radius: 1.5em;
    cursor: pointer;
    font-weight: bold;
    width: 100vw;
    display: block;
    outline: 0;
    background-color: currentColor;
    margin: 1em auto;
  }

  span {
    color: white;
  }

  button:hover {
    animation-name: button-animation;
    animation-fill-mode: forwards;
    animation-duration: 0.5s;
  }

  @media only screen and (min-width: 640px) {
    button {
      width: 100%;
    }
  }

  @keyframes button-animation {
    from {
      transform: translateY(0);
      box-shadow: none;
    }
    to {
      transform: translateY(-0.5em);
      box-shadow: 0 0.5em 0 0 #ddd;
    }
  }

  // the following styled should be ignored, as they are not needed
  strong {
    color: red;
  }

  .unused_styles {
    border: 0;
    height: 3em;
    padding: 0 2em;
    border-radius: 1.5em;
    cursor: pointer;
    font-weight: bold;
    width: 100vw;
    display: block;
    outline: 0;
    background-color: currentColor;
    margin: 1em auto;
  }
`;

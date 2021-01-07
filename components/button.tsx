import css from "styled-jsx/css";

enum Color {
  blue = "dodgerblue",
  yellow = "#e3b307",
  green = "#57b004",
}

type Props = {
  children: string;
  color?: keyof typeof Color;
};

export function Button(props: Props) {
  const { children, color = "blue" } = props;

  return (
    <button>
      <span>{children}</span>

      <style jsx>{button}</style>
      <style jsx>
        {`
          // dynamic styles, better to be separate
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

  & span {
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
`;

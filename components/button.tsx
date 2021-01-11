import { keyframes, style, media } from "typestyle";
import { NestedCSSProperties } from "typestyle/lib/types";

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
    <button onClick={onClick} className={getStyle(color)}>
      <span>{children}</span>
    </button>
  );
}

const button_animation = keyframes({
  from: {
    transform: "translateY(0)",
    boxShadow: "none",
  },
  to: {
    transform: "translateY(-0.5em)",
    boxShadow: "0 0.5em 0 0 #ddd",
  },
});

const button_styles: NestedCSSProperties = {
  border: 0,
  height: "3em",
  padding: "0 2em",
  borderRadius: "1.5em",
  cursor: "pointer",
  fontWeight: "bold",
  width: "100vw",
  display: "block",
  outline: 0,
  backgroundColor: "currentColor",
  margin: "1em auto",

  $nest: {
    "&:hover": {
      animationName: button_animation,
      animationFillMode: "forwards",
      animationDuration: "0.5s",
    },

    "& span": {
      color: "white",
    },

    "& strong": {
      color: "red",
    },

    "& .unused_styles": {
      border: 0,
      height: "3em",
      padding: "0 2em",
      borderRadius: "1.5em",
      cursor: "pointer",
      fontWeight: "bold",
      width: "100vw",
      display: "block",
      outline: 0,
      backgroundColor: "currentColor",
      margin: "1em auto",
    },
  },
};

function getStyle(color: keyof typeof Color) {
  return style(
    button_styles,
    {
      color: Color[color],
    },
    media(
      { minWidth: 640 },
      {
        width: "100%",
      }
    )
  );
}

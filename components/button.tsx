import { CssFelaStyle, useFela } from "react-fela";

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
  const { children, onClick } = props;
  const { css } = useFela(props);

  return (
    <button onClick={onClick} className={css(buttonStyle)}>
      <span className={css(textStyle)}>{children}</span>
    </button>
  );
}

const textStyle = {
  color: "white",
};

const button_animation = {
  from: {
    transform: "translateY(0)",
    boxShadow: "none",
  },
  to: {
    transform: "translateY(-0.5em)",
    boxShadow: "0 0.5em 0 0 #ddd",
  },
};

const buttonStyle: CssFelaStyle<{}, Props> = (props) => ({
  border: 0,
  height: "3em",
  padding: "0 2em",
  borderRadius: "1.5em",
  cursor: "pointer",
  fontWeight: "bold",
  width: "100vw",
  display: "block",
  outline: 0,
  backgroundColor: "currentcolor",
  margin: "1em auto",

  color: Color[props.color || "grey"],

  ":hover": {
    animationName: button_animation,
    animationFillMode: "forwards",
    animationDuration: "0.5s",
  },

  "@media (min-width: 640px)": {
    width: "100%",
  },

  "& .unused_styles": {
    color: "red",
    border: 0,
    height: "3em",
    padding: "0 2em",
    borderRadius: "1.5em",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100vw",
    display: "block",
    outline: 0,
    backgroundColor: "currentcolor",
    margin: "1em auto",
  },
});

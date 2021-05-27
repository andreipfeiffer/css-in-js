import { styled, keyframes } from "../stitches.config";

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

  return (
    <StyledButton onClick={onClick} color={props.color || "grey"}>
      <span>{children}</span>
    </StyledButton>
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

const StyledButton = styled("button", {
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

  span: {
    color: "white",
  },

  "&:hover": {
    animation: `${button_animation}`,
    animationFillMode: "forwards",
    animationDuration: "0.5s",
  },

  // breakpoints defined in config
  "@desktop": {
    width: "100%",
  },

  variants: {
    color: {
      blue: {
        color: Color.blue,
      },
      green: {
        color: Color.green,
      },
      yellow: {
        color: Color.yellow,
      },
      red: {
        color: Color.red,
      },
      grey: {
        color: Color.grey,
      },
    },
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

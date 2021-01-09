import styled, { css, keyframes } from "styled-components";

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
  className?: string;
};

function UnstyledButton(props: Props) {
  const { children, /*color = "grey",*/ onClick, className } = props;

  return (
    <button onClick={onClick} className={className}>
      <span>{children}</span>
    </button>
  );
}

// cannot use objects for keyframes
// also, we must use "css" here, not "keyframes",
// because we interpolate in a style object
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

// can also use objects, with offer code completion
const StyledButton = styled(UnstyledButton)`
  color: ${(props) => Color[props.color || "grey"]};
`;

export const Button = styled(StyledButton)(
  {
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

    // "&:hover": {
    //   // animationName: `${button_animation}`,
    //   animationFillMode: "forwards",
    //   // animationDuration: "0.5s",
    // },

    "@media only screen and (min-width: 640px)": {
      width: "100%",
    },

    "& span": {
      color: "white",
    },

    // the following styled should be ignored, as they are not needed
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
  css`
    &:hover {
      animation-name: ${button_animation};
      animation-fill-mode: forwards;
      animation-duration: 0.5s;
    }
  `
);

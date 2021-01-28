import { styled, keyframes } from "goober";

enum Color {
  grey = "#cccccc",
  blue = "dodgerblue",
  yellow = "#e3b307",
  green = "#57b004",
  red = "#db2e02",
}

type Props = {
  children: React.ReactNode;
  color?: keyof typeof Color;
  onClick?(): void;
};

export function Button(props: Props) {
  const { children } = props;

  return (
    <StyledButton {...props}>
      <span>{children}</span>
    </StyledButton>
  );
}

const button_animation = keyframes`
    from {
      transform: translateY(0);
      box-shadow: none;
    }
    to {
      transform: translateY(-0.5em);
      box-shadow: 0 0.5em 0 0 #ddd;
    }
`;

const StyledButton = styled("button")<Props>`
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
  color: ${(props) => Color[props.color || "grey"]};

  & span {
    color: white;
  }

  &:hover {
    animation-name: ${button_animation};
    animation-fill-mode: forwards;
    animation-duration: 0.5s;
  }

  @media only screen and (min-width: 640px) {
    width: 100%;
  }

  /* the following styled should be ignored, as they are not needed */
  & strong {
    color: red;
  }

  & .unused_styles {
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

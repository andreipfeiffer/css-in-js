import { style, styleMap } from "treat";
import { ColorVariants, Color } from "./button.types";

export const button = style({
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

  ":hover": {
    // no need to specify the animation-name as it will be automatically attached when you specify @keyframes
    // animationName: "button-animation",
    animationFillMode: "forwards",
    animationDuration: "0.5s",

    "@keyframes": {
      from: {
        transform: "translateY(0)",
        boxShadow: "none",
      },
      to: {
        transform: "translateY(-0.5em)",
        boxShadow: "0 0.5em 0 0 #ddd",
      },
    },
  },

  "@media": {
    "screen and (min-width: 640px)": {
      width: "100%",
    },
  },
});

export const button_text = style({
  color: "white",
});

export const button_variants = styleMap<ColorVariants>({
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
});

export const unused_styles = style({
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
  backgroundColor: "currentColor",
  margin: "1em auto",
});

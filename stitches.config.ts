import { createCss } from "@stitches/react";

const theme = {
  colors: {},
};

export const { styled, css, global, keyframes, getCssString } = createCss({
  theme,
  media: {
    desktop: `(min-width: 640px)`,
  },
});

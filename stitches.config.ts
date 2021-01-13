import { createStyled } from "@stitches/react";

const theme = {
  colors: {},
};

export const { styled, css } = createStyled({
  tokens: theme,
  breakpoints: {
    desktop: (rule) => `@media (min-width: 640px) { ${rule} }`,
  },
});

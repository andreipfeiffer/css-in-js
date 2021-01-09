Various **CSS-in-JS** solutions comparison in React, using **CSS modules** as a baseline and **Next.js** as a fully featured framework for building resources.

## Getting Started

```bash
# install dependencies
yarn

# for development
yarn dev

# for production
yarn build
yarn start
```
<br />

## Overview

|                   | Global styles | SSR   | Dedupe | Unused code | DX    | TS    | Prefixes | Lib  | Page |
| :---------------- | :-----------: | :---: | :----: | :---------: | :---: | :---: | :------: | ---: | ---: |
| [CSS Modules](#css-modules)             | ✅ | ✅ | ❌ | ? | ✅ | 🟠 | ✅ | -      | -      |
| [Styled JSX](#styled-jsx)               | ✅ | ✅ | ❌ | ❌ | 🟠 | 🟠 | ✅ | +3.5KB | +4.4KB |
| [Styled Components](#styled-components) | 🟠 | ✅ | ? | 🟠 | 🟠 | ✅ | ✅ | +13.8KB | +14.5KB |
| Emotion           |  |  |  |  |  |  |  |  |
| Glamor            |  |  |  |  |  |  |  |  |
| Cxs               |  |  |  |  |  |  |  |  |
| Aphrodite         |  |  |  |  |  |  |  |  |
| Linaria           |  |  |  |  |  |  |  |  |

<br />

**LEGEND**:

- **Global styles**: ability to easily add global styles, as any other style, without the need for using special APIs, or hacks;
- **SSR**: ability to Server-Side Render the styles, usage with Next.js SSR/SSG
- **Dedupe**: ability to deduplicate served resources, if a component is used on multiple routes (this might be a Next.js limitation, that could be fixed with module federation on build)
- **Unused code**: out-of-the-box optimisation for removing styles that are not used in components
- **DX**: Developer eXperience which includes:
   - syntax highlighting
   - code-completion for CSS properties and values
- **TS**: TypeScript support for library API, either built-in, or via `@types` package
- **External**: ability to extract styles in a separate file
- **Prefixes**: out-of-the-box ability to add vendor specific prefixes
- **Lib**: size in KB of the library that is shipped in a production build
- **Bundle**: increase in KB (as an average), for an entire single page built for production

<br />

### Overall observations

✅ **Code splitting**  
Components used only in a specific route will only be bundled for that route. This is something that Next.js performs out-of-the-box.

❌ **No component deduping**  
If a component is imported by 2 different routes, it will be send twice to the client. This is probably a limitation of Next.js and probably could be fixed with module federation, currently not supported in Next.js 10.

<br />

### CSS modules

- **TypeScript** can be used, but only as inline styles, not in CSS files
- same applies for **dynamic or user styles**, which basically is the most performant, right?

```
Page                                Size     First Load JS
┌ ○ /                               2.15 kB        64.9 kB
├   └ css/7a5b6d23ea12e90bddea.css  407 B
├   /_app                           0 B            62.7 kB
├ ○ /404                            3.03 kB        65.7 kB
└ ○ /other                          706 B          63.4 kB
    └ css/57bb8cd5308b249275fa.css  443 B
+ First Load JS shared by all       62.7 kB
  ├ chunks/commons.7af247.js        13.1 kB
  ├ chunks/framework.9d5241.js      41.8 kB
  ├ chunks/main.03531f.js           6.62 kB
  ├ chunks/pages/_app.6e472f.js     526 B
  ├ chunks/webpack.50bee0.js        751 B
  └ css/d9aac052842a915b5cc7.css    325 B
```

<br />

### Styled JSX

- 🟠 need additional editor plugin for highlight & language service
- 🟠 has types on DT, but not sure if/how they help, as there isn't any library API to use (or very minimal)
- 🟠 no utilities
- 🟠 bundles all defined styles even if they are not used in component
- ✅ out-of-the-box support with Next.js
- ✅ has a minimal API, so it has a low learning curve
- ✅ full CSS support apparently
- ✅ styles on element/tags like `button` are automatically scoped (unique class names are added)
- ✅ can get generated `className`, or `styles` object (but it contains an entire React component, with all the static & dynamic styles)
- ✅ page styles are more convenient, because they can be colocated within the Page component

**Observations**:
- need to [split static & dynamic styles](https://github.com/vercel/styled-jsx#dynamic-styles), otherwise it will render duplicate output
- cannot use nesting, like `& span`, or `&:hover`
- don't know how to see/debug client toggled styles, as they are nowhere to be found in dev tools (in production)
- user input styles: it generates a new class name for each change, but it removes the old one
- unique class names are added to elements that are not targetted in style definition (highly polluted html)
- SSR styles are sent as `<style>` tag, which prevents paralel resourse fetch, thus increasing FCP

```
Page                                                           Size     First Load JS
┌ ○ /                                                          2.64 kB        69.3 kB
├   /_app                                                      0 B            66.6 kB
├ ○ /404                                                       3.03 kB        69.6 kB
└ ○ /other                                                     1.17 kB        67.8 kB
+ First Load JS shared by all                                  66.6 kB
  ├ chunks/1dfa07d0b4ad7868e7760ca51684adf89ad5b4e3.3baab1.js  3.53 kB
  ├ chunks/commons.7af247.js                                   13.1 kB
  ├ chunks/framework.9d5241.js                                 41.8 kB
  ├ chunks/main.99ad68.js                                      6.62 kB
  ├ chunks/pages/_app.949398.js                                907 B
  └ chunks/webpack.50bee0.js                                   751 B
```

<br />

### Styled Components

- 🟠 it has a higher learning curve
- 🟠 need additional editor plugin for highlight & language service
- 🟠 no utilities
- 🟠 bundles nested styles even if they are not used in component (however, if you don't use a StyledComponent, it won't be bundled, as it is not referenced)
- ✅ full CSS support apparently
- ✅ pretty good TS support, except when using Object Styles, which is a newer approach apparently
- ✅ provides nesting selectors
- ✅ out-of-the-box theming support

**Observations**:
- need to split static & dynamic styles, otherwise it will render duplicate output
- de-facto are Tagged Templates, but you can also use Object Styles, however mixing them is confusing, because syntax is different (kebab vs camel, EOL character, quotes, etc)
- some more complex syntax appears to be a bit cumbersome to get it right

```
Page                                                           Size     First Load JS
┌ ○ /                                                          2.5 kB         79.4 kB
├   /_app                                                      0 B            76.9 kB
├ ○ /404                                                       3.03 kB        79.9 kB
└ ○ /other                                                     1.04 kB        77.9 kB
+ First Load JS shared by all                                  76.9 kB
  ├ chunks/1dfa07d0b4ad7868e7760ca51684adf89ad5b4e3.3f0ffd.js  13.8 kB
  ├ chunks/commons.7af247.js                                   13.1 kB
  ├ chunks/framework.9d5241.js                                 41.8 kB
  ├ chunks/main.99ad68.js                                      6.62 kB
  ├ chunks/pages/_app.7093f3.js                                921 B
  └ chunks/webpack.50bee0.js                                   751 B
```

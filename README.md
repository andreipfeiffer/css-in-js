This is a [Next.js](https://nextjs.org/) project.

## Getting Started

First, run the development server:

```bash
yarn dev
```
<br />

## Overview

|       | Global styles | SSR | Dedupe | Dead code elimination | DX    | TS | External | Prefixes | Size | Page |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | ---: | ---: |
| CSS Modules | ✅ | ✅ | ❌ | ❌ | ✅ | 🟠 | ✅ | ✅ | - | - |
| Styled JSX  | ✅ | ✅ | ? | ❌ | 🟠 | 🟠 | ✅ | ✅ | +3.5KB | +4.4KB |
|  Styled Components |  |  |  |  |  |  |  |  |  |
|  Emotion |  |  |  |  |  |  |  |  |  |
|  Glamor |  |  |  |  |  |  |  |  |  |
|  Cxs |  |  |  |  |  |  |  |  |  |
|  Aphrodite |  |  |  |  |  |  |  |  |  |
|  Linaria |  |  |  |  |  |  |  |  |  |

<br />

**LEGEND**:

- **Global styles**: ability to easily add global styles, as any other style, without the need for using special APIs, or hacks;
- **SSR**: ability to Server-Side Render the styles, usage with Next.js SSR/SSG
- **Dedupe**: ability to deduplicate served resources, if a component is used on multiple routes (module federation)
- **Dead code elimination**: out-of-the-box optimisation for not including styles that are not used in components
- **DX**: Developer eXperience which includes:
   - syntax highlighting
   - code-completion for CSS properties and values
- **TS**: TypeScript support for library API, either built-in, or via `@types` package
- **External**: ability to extract styles in a separate file
- **Prefixes**: out-of-the-box ability to add vendor specific prefixes
- **Size**: size in KB of the library that is shipped in a production build
- **Bundle**: increase in KB (as an average), for an entire single page built for production
<br />

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
- 🟠 bundles styles even if they are not used in component
- ✅ out-of-the-box support with Next.js
- ✅ full CSS support apparently
- ✅ styles on element/tags like `button` are automatically scoped (unique class names are added)
- ✅ can get generated `className`, or `styles` object (but it contains an entire React component, with all the static & dynamic styles)
- ✅ page styles are more convenient, because they can be colocated within the Page component
- 🟠 requires manual optimisations
   - need to [split static & dynamic styles](https://github.com/vercel/styled-jsx#dynamic-styles), otherwise it will render duplicate output

**Observations**:
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

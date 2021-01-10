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

|                                         | Dead code removal | DX    | TS    | Lib  | Page |
| :-------------------------------------- | :---------------: | :---: | :---: | ---: | ---: |
| [CSS Modules](#css-modules)             | ❌ | ✅ | 🟠 | -        | -        |
| [Styled JSX](#styled-jsx)               | ❌ | 🟠 | 🟠 |  +3.5 KB |  +4.4 KB |
| [Styled Components](#styled-components) | 🟠 | 🟠 | ✅ | +13.8 KB | +14.5 KB |
| [Emotion](#emotion)                     | 🟠 | ✅ | ✅ |  +7.1 KB | +11.2 KB |
| [Treat](#treat)                         | 🟠 | 🟠 | ✅ | -        | -        |
| Glamor            |  |  |  |  |  |
| Cxs               |  |  |  |  |  |

<br />

**LEGEND**:

- **Dead code removal**: out-of-the-box optimisation for removing (not bundling) styles that are not used in components
- **DX**: Developer eXperience which includes:
   - syntax highlighting
   - code-completion for CSS properties and values
- **TS**: TypeScript support for library API, either built-in, or via `@types` package
- **Lib**: size in KB of the library that is shipped in a production build
- **Bundle**: increase in KB (as an average), for an entire single page built for production

<br />

### Overall observations

✅ **Code splitting**  
Components used only in a specific route will only be bundled for that route. This is something that Next.js performs out-of-the-box.

✅ **Global styles**  
All solutions offer a way to define global styles, some with a separate API.  
⚠️ Exception: Aphrodite

✅ **SSR**  
All solutions are able to be Server-Side Rendered by Next.js.

✅ **Vendor prefixes**  
All solutions add vendor specific prefixes out-of-the-box.

🟠 **Increased FCP**  
SSR styles are added as `<style>` tags in the `<head>`, which will result in higher FCP than regular CSS, because `.css` files can and will be loaded in paralel to other resources, while big `<style>` content will be sent and parsed along with the HTML.

❌ **No component deduping**  
If a component is imported by 2 different routes, it will be send twice to the client. This is probably a limitation of Next.js and probably could be fixed with module federation, currently not supported in Next.js 10.

<br />

### CSS modules

- **TypeScript** can be used, but only as inline styles, not in CSS files
- same applies for **dynamic or user styles**, which basically is the most performant, right?
- media queries with TS/JS values cannot be used, so they should ne handled as inline styles with JS match media, or via SSR props from user agent

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

Very simple solution, doesn't have a dedicated website for documentation, everything is on Github. It's not popular, but it is the built-in solution in Next.js.

- 🟠 need additional editor plugin for highlight & language service
- 🟠 has TypeScript support (via `@types`), but not sure if/how they help, as there isn't any library API to use, or it's very minimal
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

Probably the most popular solution, good documentation. It uses Tagged Templates to defines styles, but can use objects as well, but apparently it's a second class citizen.

- 🟠 it has a higher learning curve
- 🟠 need additional editor plugin for highlight & language service
- 🟠 bundles nested styles even if they are not used in component (however, if you don't use a StyledComponent, it won't be bundled, as it is not referenced)
- ✅ full CSS support apparently
- ✅ pretty good TS support (via `@types`), except when using Object Styles, which is a newer approach apparently
- ✅ provides nesting selectors
- ✅ out-of-the-box theming support

**Observations**:
- need to split static & dynamic styles, otherwise it will render duplicate output
- de-facto are Tagged Templates, but you can also use Object Styles, however mixing them is confusing, because syntax is different (kebab vs camel, EOL character, quotes, etc)
- some more complex syntax appears to be a bit cumbersome to get it right
- user input styles: it generates a new class name for each change, but it does NOT remove the old one

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

<br />

### Emotion

Probably the most comprehensive, complete, sofisticated solution. Detailed documentation, built with TypeScript, looks mature being at version 11.

- 🟠 it has a higher learning curve
- 🟠 bundles nested styles even if they are not used in component
- ✅ good DX, since you can use objects (not necessarily strings), provides code completion
- ✅ built-in TypeScript support
- ✅ provides nesting selectors
- ✅ out-of-the-box theming support

**Observations**:
- dynamic props are not as straightforward to use with TS, not sure how to structure the components, I guess it needs a different angle approach
- there are naming conflicts between Component Props and Element Attribute names (see custom Input component: passed Props `onChange()` and input `onChange()`)
- user input styles: it generates a new class name for each change, but it does NOT remove the old one
- cannot (easily) split static and dynamic styles, it doesn't properly separate them, even if defined separately (highly poluted duplicated styles in head)

```
Page                                                           Size     First Load JS
┌ ○ /                                                          5.86 kB        76.1 kB
├   /_app                                                      0 B            70.2 kB
├ ○ /404                                                       3.03 kB        73.3 kB
└ ○ /other                                                     4.46 kB        74.7 kB
+ First Load JS shared by all                                  70.2 kB
  ├ chunks/1dfa07d0b4ad7868e7760ca51684adf89ad5b4e3.0d44a7.js  7.17 kB
  ├ chunks/commons.800e6d.js                                   13.1 kB
  ├ chunks/framework.9d5241.js                                 41.8 kB
  ├ chunks/main.45755e.js                                      6.55 kB
  ├ chunks/pages/_app.2f0633.js                                880 B
  └ chunks/webpack.50bee0.js                                   751 B
```

<br />

### Treat

More modern, with great TypeScript integration and low runtime overhead, it's pretty minimal in its features. Everything is processed at compile time, and it generates CSS files, similar to Linaria & CSS modules.

- 🟠 it doesn't handle dynamic styles (can use built-in `variants` based on predefined types, or inline styles for user defined styles)
- 🟠 it doesn't provide code completion for values, otherwise good DX
- 🟠 bundles defined styles even if they are not used in component (but a bit more difficult, because you are not allowed nested types)
- ✅ it has a pretty low learning curve
- ✅ full CSS support apparently
- ✅ built-in TypeScript support
- ✅ out-of-the-box theming support

**Observations**:
- it's built with restrictions in mind, great TS experience
- it's pretty similar to CSS modules, like needing external file, having CSS files generated, putting `className` strings on elements, handling dynamic styles differently, etc
- it's different to CSS modules considering:
  - TypeScript integration
  - stricter in defining styles
  - easier to use media queries with JS values
- it feels like CSS modules, but you don't write CSS

```
Page                                Size     First Load JS
┌ ○ /                               2.11 kB        64.8 kB
├   └ css/4ca0d586ad5efcd1970b.css  422 B
├   /_app                           0 B            62.7 kB
├ ○ /404                            3.03 kB        65.8 kB
└ ○ /other                          632 B          63.4 kB
    └ css/adb81858cf67eabcd313.css  435 B
+ First Load JS shared by all       62.7 kB
  ├ chunks/commons.7af247.js        13.1 kB
  ├ chunks/framework.9d5241.js      41.8 kB
  ├ chunks/main.03531f.js           6.62 kB
  ├ chunks/pages/_app.2baddf.js     546 B
  ├ chunks/webpack.50bee0.js        751 B
  └ css/08916f1dfb6533efc4a4.css    286 B
```

<br />

### Aphrodite

It's not a popular solution, the approach is similar to **React Native StyleSheets**  way of styling components. Has built-in TypeScript support and a simple API.

- global styles are a bit cumbersome to define
- no nesting support, apart from media queries & pseudo selectors
- no dynamic out-of-the-box support, so you have to get around that, like inline styles I guess, or like in React Native

**Conclusion**: doesn't add any real value, except the ergonomics to colocate styles with the component.

<br />

### Linaria

Didn't manage to start it with Next.js + TypeScript.

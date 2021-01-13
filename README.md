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

|                                         | Colocation | DX    | String | Object | TS    | .css  | <style> | Theme | Lib  | Page |
| :-------------------------------------- | :--------: | :---: | :----: | :----: | :---: | :---: | :-----: | :---: | ---: | ---: |
| [CSS Modules](#css-modules)             | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | -        | -        |
| [Styled JSX](#styled-jsx)               | ✅ | 🟠 | ✅ | ❌ | ❌ | ❌ | ✅ | 🟠 |  +3.5 KB |  +4.4 KB |
| [Styled Components](#styled-components) | ✅ | 🟠 | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | +13.8 KB | +14.5 KB |
| [Emotion](#emotion)                     | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |  +7.1 KB | +11.2 KB |
| [Treat](#treat)                         | ❌ | 🟠 | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | -        | -        |
| [TypeStyle](#typestyle)                 | ✅ | 🟠 | ❌ | ✅ | ✅ | ❌ | ✅ | 🟠 |  +3.1 KB |  +3.7 KB |
| [Fela](#fela)                           | ✅ | ❔ | ❔ | ✅ | ❔ | ❔ | ✅ | ❔ |      ??? |      ??? |
| [Stitches](#stitches)                   | ✅ | ❔ | ❔ | ✅ | ❔ | ❔ | ✅ | ❔ |      ??? |      ??? |
| [JSS](#jss)                             | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | +19.0 KB | +20.0 KB |
| [Otion](#otion)                         | ✅ | ❔ | ❔ | ✅ | ❔ | ❔ | ✅ | ❔ |      ??? |      ??? |

<br />

**LEGEND**:

- **Colocation**: ability to define styles within the same file as the component (this ability also gives you the option to move the styles into a separate file and import them, but not the other way around).
- **DX**: Developer eXperience which includes:
   - syntax highlighting
   - code-completion for CSS properties and values
- **String**: support for defining styles as strings, using ES Tagged Templates and writing property names in kebab-case, like in CSS
- **Object**: support for defining styles as objects, by writing property names in camelCase
- **TS**: TypeScript support for library API, either built-in, or via `@types` package
- **.css**: support for extracting and serving the styles as native `.css` files
- **style tag**: support for serving the styles as injected `<style>` tags in the document's `<head>`
- **Theme**: built-in support for Theming or managing design tokens/system
- **Lib**: size in KB of the library that is shipped in a production build
- **Bundle**: increase in KB (as an average), for an entire single page built for production

<br />

### Overall observations

✅ **Code splitting**  
Components used only in a specific route will only be bundled for that route. This is something that Next.js performs out-of-the-box.

✅ **Global styles**  
All solutions offer a way to define global styles, some with a separate API.  
   - **JSS** has a convoluted API for this, which requires an additional plugin, which we didn't figure out how to implement

✅ **SSR**  
All solutions are able to be Server-Side Rendered by Next.js.

✅ **Vendor prefixes**  
All solutions add vendor specific prefixes out-of-the-box.
   - **JSS** requires an additional plugin for this

✅ **Unique class names**  
All solutions generate unique class names, like CSS Modules do.

✅ **Full CSS support**  
All solutions support most CSS properties that you would need: **pseudo classes & elements**, **media queries**, **keyframes** are the ones that we tested.

🟠 **Increased FCP**  
For solutions that don't support `.css` file extraction, **SSRed** styles are added as `<style>` tags in the `<head>`, which will result in higher FCP than regular CSS, because `.css` files can and will be loaded in paralel to other resources, while big `<style>` content will be sent and parsed along with the HTML. 
- **CSS Modules** and **Treat** dont' have this problem, because they extract

🟠 **Dead code removal**  
Most solution say they remove unused code/styles. This is only **half-true**. Unused code is indeed more difficult to accumulate, especially of you compare it to large `.css` files as we used to write a century ago. But when compared to CSS Modules, the differencies are not that big. Any solution that offers the option to write **selectors** or **nested styles** will bundle unused styles. Even solutions that don't offer this option, have the same problem.

🟠 **Debugging / Inspecting**  
Most solutions inject the `<style>` tag in the DOM in `DEVELOPMENT`, which is a slower approach, but enables style inspecting using browser dev tools. But when building for `PRODUCTION`, they use [`CSSStyleSheet.insertRule()`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule) to inject the styles directly into the CSSOM, which is a way faster approach, but you cannot inspect the styles.
   - **JSS** uses `insertRule()` in dev mode as well, so you cannot see what gets injected

Basically, what you get is code removal when you delete the component, because the styles are colocated. Also, when using Styled Components syntax (available with many solutions) you get the styles removed when you delete the Styled Component.

❌ **No component deduping**  
If a component is imported by 2 different routes, it will be send twice to the client. This is probably a limitation of Next.js and probably could be fixed with module federation, currently not supported in Next.js 10.

<br />

### CSS modules

- **TypeScript** can be used, but only as inline styles, not in CSS files, same applies for **dynamic or user styles**
- media queries with TS/JS values cannot be used, so they should be handled as inline styles with JS match media, or via SSR props from user agent

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
- ✅ styles on element/tags like `button` are automatically scoped (unique class names are added)
- ✅ can get generated `className`, or `styles` object (but it contains an entire React component, with all the static & dynamic styles)
- ✅ page styles are more convenient, because they can be colocated within the Page component

**Observations**:
- need to [split static & dynamic styles](https://github.com/vercel/styled-jsx#dynamic-styles), otherwise it will render duplicate output
- cannot use nesting, like `& span`, or `&:hover`
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
- ✅ pretty good TS support (via `@types`), except when using Object Styles, which is a newer approach apparently
- ✅ provides nesting selectors

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
- 🟠 bundles defined styles even if they are not used in component (but a bit more difficult, because you are not allowed nested types)
- ✅ great DX, code completion out-of-the-box
- ✅ it has a pretty low learning curve
- ✅ built-in TypeScript support

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

### TypeStyle

Minimal library, focused only on type-checking. It is framework agnostic, that's why it doesn't have a special API for handling dynamic styles. There are React wrappers (at least 2) but the typing feels a bit cumbersome.

- 🟠 it doesn't handle dynamic styles, you have to use JS functions to compute styles
- 🟠 bundles nested styles even if they are not used in component
- 🟠 it has a learning curve, you don't feel you write CSS
- 🟠 out-of-the-box theming support (but it uses TS namespaces, which is a non-recommended feature of the language)
- ✅ great DX, code completion out-of-the-box
- ✅ built-in TypeScript support

**Observations**:
- it creates a single `<style>` tag, with all the styles bundled, and replaced (don't know if this has a major impact, since it replaces the entire tag)
- don't know how to split dynamic and static styles, it's easy to create duplicate styles
- overall, you have to learn new ways to write CSS, with the only benefit of colocating styles

```
Page                                                           Size     First Load JS
┌ ○ /                                                          2.41 kB        68.6 kB
├   /_app                                                      0 B            66.2 kB
├ ○ /404                                                       3.03 kB        69.2 kB
└ ○ /other                                                     953 B          67.1 kB
+ First Load JS shared by all                                  66.2 kB
  ├ chunks/1dfa07d0b4ad7868e7760ca51684adf89ad5b4e3.250ad4.js  3.09 kB
  ├ chunks/commons.7af247.js                                   13.1 kB
  ├ chunks/framework.9d5241.js                                 41.8 kB
  ├ chunks/main.99ad68.js                                      6.62 kB
  ├ chunks/pages/_app.d59d73.js                                893 B
  └ chunks/webpack.50bee0.js                                   751 B
```

<br />

### Fela

<br />

### Stitches

<br />

### JSS

It appears to be a mature solution, with big docs and plugings. The API is intuitive and very easy to use, love it. However, it lacks some modern features, especially TS support and code completion.

- ❌ no code completion, although it uses style objects
- ❌ no TS support
- 🟠 bundles nested styles even if they are not used in component
- 🟠 provides nesting selectors, but only with plugin (which adds even more to bundle)
- ✅ it has a low learning curve

**Observations**:
- `react-jss` uses className by default. There's also `styled-jss` that uses Styled Components approach, but it has no types, and couldn't make it work on top of `react-jss`.
- the way you attach styles to components is similar to React Native StyleSheets, you define an object with all subcomponents styles, and attach them to various subcomponents classnames.
- very easy and simple to use API, intuitive
- lack TS support, you can feel it when dealing with dynamic styles based on props, which can't be typed and statically checked
- no intellisence on properties/values
- nesting not supported ootb, but has a plugin for that
- global styles are cumbersome to setup, requires plugin, tried to mix the JSS setup docs, with the react-jss SSR setup docs, with the plugin-globals docs on usage, no luck (using the default global stylesheet instead)
- looks like it's the most heavy-weighted solution
- cannot see injected styles: https://github.com/cssinjs/jss/issues/1125#issue-455194189

```
Page                              Size     First Load JS
┌ ○ /                             1.98 kB        84.9 kB
├   /_app                         0 B            64.3 kB
├ ○ /404                          3.03 kB        67.3 kB
└ ○ /other                        501 B          83.5 kB
+ First Load JS shared by all     64.3 kB
  ├ chunks/commons.7af247.js      13.1 kB
  ├ chunks/framework.37f4a7.js    42.1 kB
  ├ chunks/main.99ad68.js         6.62 kB
  ├ chunks/pages/_app.ea9fff.js   1.78 kB
  ├ chunks/webpack.50bee0.js      751 B
  └ css/d9aac052842a915b5cc7.css  325 B
```

<br />

### Otion

<br />
---
<br />

### Aphrodite

It's not a popular solution, the approach is similar to **React Native StyleSheets**  way of styling components. Has built-in TypeScript support and a simple API.

- global styles are a bit cumbersome to define
- no nesting support, apart from media queries & pseudo selectors
- no dynamic out-of-the-box support, so you have to get around that, like inline styles I guess, or like in React Native

**Conclusion**: doesn't add any real value, except the ergonomics to colocate styles with the component.

<br />

### Glamor

I got it started with Next.js, but it feels fragile. The [Glamor official example](https://github.com/vercel/next.js/tree/canary/examples/with-glamor) throws an error regarding `rehydrate`. When commenting it out, it works, but not sure what the consequences are.

- it looks like an unmaintained or abandoned package
- documentation is so and so
- lacks any TS support
- has a lot of documented experimental features, marked as "buggy"

**Conclusion**: it feels like a side/internal project at FB, that is not used anymore.

<br />

### Linaria

Didn't manage to start it with Next.js + TypeScript.

It was an interesting solution, as it promises zero-runtime overhead, generating `.css` files at build time, while the style are colocated within the components.

### Cxs

Didn't manage to start it with Next.js + TypeScript. The [official example](https://github.com/vercel/next.js/tree/canary/examples/with-cxs) uses version 3, while today we have version 6. The example doesn't work, because the API has changed.

The solution looked interesting, because it is supposed to be very light weight.

### Astroturf

Didn't manage to start it with Next.js + TypeScript. The [official example](https://github.com/vercel/next.js/tree/canary/examples/with-astroturf) uses an older version of Next.js.

The solution is not that popular, but it used `.css` extraction with colocated styles.

### Styletron

It looks like a not so popular solution, which also lacks support for TypeScript. It looks like the maintainers work at Uber and they use it internally. It focused on generating unique atomic CSS classes, which could potentially deduplicate a lot of code.

### Radium

The projest was put in [Maintenance Mode](https://formidable.com/blog/2019/radium-maintenance/). They recommend other solutions.

### Glamorous

The project was [discountinued](https://github.com/paypal/glamorous/issues/419) in favor of Emotion.

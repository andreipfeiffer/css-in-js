# 🚧 [WIP DRAFT] CSS-in-TS research analysis

_Last update: **Jan 2021**_

This document is a thorough analysis of all the current **CSS-in-JS** solutions.  

The baseline is a **CSS modules** approach, and **Next.js** as a full-featured SSR framework for building resources with full **TypeScript** support.

<br />

## Table of contents

- [Overview](#overview)
  - [CSS Modules](#css-modules)
  - [Styled JSX](#styled-jsx)
  - [Styled Components](#styled-components)
  - [Emotion](#emotion)
  - [Treat](#treat)
  - [TypeStyle](#typestyle)
  - [Fela](#fela)
  - [Stitches](#stitches)
  - [JSS](#jss)
- [Motivation](#motivation)
- [Goals](#goals)
- [Disclaimer](#disclaimer)
- [Running the examples](#running-the-examples)

<br />

## Overview

|      | 1. Co&#8209;location | 2. DX | 3. `` css` ` `` | 4. `{}` | 5. TS | 6. `.css` | 7. `<style>` | 8. Atomic | 9. Theme | 10. `className` | 11. `styled.p` | 12. `css` prop | 13. Learn | 14. Lib  | 15. Page |
| :--- | :------------------: | :---: | :-------------: | :-----: | :---: | :-------: | :----------: | :-------: | :------: | :-------------: | :------------: | :------------: | :-------: |     ---: |     ---: |
| [CSS Modules](#css-modules)             | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | 📉 | -        | -        |
| [Styled JSX](#styled-jsx)               | ✅ | 🟠 | ✅ | ❌ | 🟠 | ❌ | ✅ | ❌ | 🟠 | ✅ | ❌ | ❌ | 📉 |  +3.5 KB |  +4.4 KB |
| [Styled Components](#styled-components) | ✅ | 🟠 | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ | 🟠 | 📈 | +13.8 KB | +14.5 KB |
| [Emotion](#emotion)                     | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ? | ? | ? | 📈 |  +7.1 KB | +11.2 KB |
| [Treat](#treat)                         | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ? | ? | ? | 📉 | -        | -        |
| [TypeStyle](#typestyle)                 | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | 🟠 | ? | ? | ? | 📈 |  +3.1 KB |  +3.7 KB |
| [Fela](#fela)                           | ✅ | ❌ | 🟠 | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ? | ? | ? | 📉 | +13.7 KB | +13.7 KB |
| [Stitches](#stitches)                   | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ? | ? | ? | 📉 |  +8.5 KB |  +9.0 KB |
| [JSS](#jss)                             | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ? | ? | ? | 📉 | +19.0 KB | +20.0 KB |

<br />

**LEGEND**:

✅ - full & out-of-the-box support  
🟠 - partial/limited support (or not ideal)  
❌ - lack of support  

1. **Co-location**: ability to define styles within the same file as the component.  
  You can also extract the styles into a separate file and import them, but the other way around does not apply.
2. **DX**: Developer eXperience which includes:
    - syntax highlighting
    - code-completion for CSS properties and values
3. **String**: support for defining styles as strings
    - uses ES Tagged Templates and `kebab-case` for property names, just like plain CSS syntax
    - enables easier migration from plain CSS to CSS-in-JS, because you don't have to re-write your styles
    - requires additional code editor plugins for syntax highlight and code completion
4. **Object**: support for defining styles as objects
    - uses plain JacaScript Objects and `camelCase` for property names
    - more suitable for new projects, when you don't need to migrate existing CSS
    - without TS support, you won't get code completion
5. **TS**: TypeScript support for library API, either built-in, or via `@types` package, which should include
    - typings for the library API
    - Style Object typings (in case the library supports the object syntax)
    - `Props` generics (if needed)
6. **`.css`**: support for extracting and serving the styles as native `.css` files
    - this increases FCP metric because the document is parsed faster, and .css files can be fetched in parallel with other resources
    - it also reduces bundle size, because you don't need runtime styles evaluation, to inject the styles
    - dynamic styling could potentially increase the generated file, because all style combinations must be pre-generated at built time
    - more suitable for less dynamic solutions (ie: e-commerce)
7. **`style` tag**: support for serving the styles as injected `<style>` tags in the document's `<head>`
    - makes dynamic styling super easy
    - incurs longer load
    - more suited for highly dynamic and interactive applications
8. **Atomic**: ability to generate atomic css classes and increasing reusability, reducing style duplication
    - this generates a separate CSS class for each CSS property (or for each unique combination of classes)
    - you'll get larger HTML files, because each styled element will contain a large number of CSS classes applied
    - it will theoretically reduce the scaling growth of your styles
9. **Theme**: built-in support for Theming or managing design tokens/system
10. **`className`**: the API returns a string which you have to add to your component/element
    - similar how you would use regular styling of React components
11. **`styled`**: the API creates a wrapper (styled) component which includes the `className`(s), which you'll render
    - you'll have to learn a new way to define styles
    - it also introduces a bit of indiretion when figuring out what native element gets rendered
12. **`css` prop**: allows passing styles using a special css prop, similar to inline styles
    - this is usually an additional feature for styled components, but it can also work separately
    - it's a nice and flexible ergonomic API
13. **Learn**: a slightly subjective opinion regarding the learning curve, you should really evaluate this on your own
14. **Lib**: size in KB of the library that is shipped in a production build
15. **Bundle**: increase in KB (as an average), for the entire index page production build
    - keep in mind that this includes an almost __empty page__, with only a couple of components, which is great for evaluating the cost of the solution, but does not offer any insight on how it scales (logarithmic, linear, or exponential)

<br />

### Overall observations

✅ **Code splitting**  
Components used only in a specific route will only be bundled for that route. This is something that Next.js performs out-of-the-box.

<br />

✅ **Global styles**  
All solutions offer a way to define global styles, some with a separate API.  
   - **JSS** has a convoluted API for this, which requires an additional plugin, which we didn't figure out how to implement

<br />

✅ **SSR**  
All solutions are able to be Server-Side Rendered by Next.js.

<br />

✅ **Vendor prefixes**  
All solutions add vendor specific prefixes out-of-the-box.
   - **JSS** requires an additional plugin for this

<br />

✅ **Unique class names**  
All solutions generate unique class names, like CSS Modules do.

<br />

✅ **Full CSS support**  
All solutions support most CSS properties that you would need: **pseudo classes & elements**, **media queries**, **keyframes** are the ones that we tested.

<br />

🟠 **Increased FCP**  
For solutions that don't support `.css` file extraction, **SSRed** styles are added as `<style>` tags in the `<head>`, which will result in higher FCP than using regular CSS, because `.css` files can and will be loaded in paralel to other resources, while big `<style>` content will be sent and parsed along with the HTML, increasing parsing time. 
- solutions that perform `.css` file extraction don't have this problem (this includes **CSS Modules** and **Treat**)

<br />

🟠 **Dead code removal**  
Most solution say they remove unused code/styles. This is only **half-true**. Unused code is indeed more difficult to accumulate, especially of you compare it to large `.css` files as we used to write a century ago. But when compared to CSS Modules, the differencies are not that big. Any solution that offers the option to write **selectors** or **nested styles** will bundle unused styles. Even solutions that don't offer this option, have the same problem.

<br />

🟠 **Debugging / Inspecting**  
Most solutions inject the `<style>` tag in the DOM in `DEVELOPMENT`, which is a slower approach, but enables style inspecting using browser dev tools. But when building for `PRODUCTION`, they use [`CSSStyleSheet.insertRule()`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule) to inject the styles directly into the CSSOM, which is a way faster approach, but you cannot inspect the styles.
   - **JSS** and **Stitches** use `insertRule()` in dev mode as well, so you cannot see what gets injected

Basically, what you get is code removal when you delete the component, because the styles are colocated. Also, when using Styled Components syntax (available with many solutions) you get the styles removed when you delete the Styled Component.

<br />

❌ **No component deduping**  
If a component is imported by 2 different routes, it will be send twice to the client. This is surely a limitation of the bundler/build system, in our case Next.js and probably could be fixed with [module federation](https://webpack.js.org/concepts/module-federation/#use-cases), currently not supported in Next.js 10.

<br />

---

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

Version: __`3.4`__ | Maintained by [Vercel](https://github.com/vercel) | Launched in __2017__ | [View Docs](https://github.com/vercel/styled-jsx)

<br />

- ✅ __Styles/Component co-location__
- 🟠 __Context-aware code completion__:  to get syntax highlighting & code completion, an editor extension is required
- 🟠 __TypeScript support__:  `@types` can be additionaly installed, but the API is too minimal to require TS (the whole definition is 22 lines of simple code)
- ❌ __No Atomic CSS__
- ❌ __No Theming support__

- __Styles output__
  - ❌ `.css` file extraction
  - ✅ `<style>` tag injection

- __Styles definition method(s)__
  - ✅ Tagged Templates
  - ❌ Style Objects

- __Styles usage method(s)__
  - ✅ `className`
  - ❌ `styled` component
  - ❌ `css` prop

- 📉 __Low Learning curve__: because the API is minimal and very simple

<br />

#### Other worth mentioning observations

- 😌 out-of-the-box support with Next.js
- 👍 for user input styles, it generates a new class name for each change, but it removes the old one
- 😏 unlike CSS modules, you can target HTML `elements` also, and it generates unique class names for them
- 🤓 you'll need to optimize your styles by [splitting static & dynamic styles](https://github.com/vercel/styled-jsx#dynamic-styles), to avoid rendering duplicated styles
- 🤨 unique class names are added to elements, even if you don't target them in your style definition, resulting in un-needed slight html pollution
- 😕 it will bundle any defined styles, regardless if they are used or not, just like plain CSS
- 😢 cannot use __nesting__, so defining __pseudo classes__ or __media queries__ has the same downsides as plain CSS, requiring selectors/class names duplication

<br />

#### Conclusion

Overall, you feel like writting plain CSS, with the added benefit of being able to define the styles along with the component, so you __don't need an additional `.css` file__, but you can extract the styles if you choose to. You can also __use any JS/TS constants of functions__. Working with __dynamic styles is pretty easy__ because it's plain JavaScript in the end. You get all these benefits at a very low price, with a pretty __small bundle overhead__.

The downsides are the overall experience of writting plain CSS. __Without nesting support__ pseudo classes and media queries getting pretty cumbersome to define.

<br />

Page overhead: __+4.4 KB__

<br />

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

For sure one of the most popular and mature solutions, with good documentation. It uses Tagged Templates to defines styles, but can use objects as well.

Version: __`5.2`__ | Maintained by [Max Stoiber](https://twitter.com/mxstbr) & [others](https://opencollective.com/styled-components#category-ABOUT) | Launched in __2016__ | [View Docs](https://styled-components.com/docs)

<br />

- ✅ __Styles/Component co-location__
- ✅ __TypeScript support__:  `@types` can be additionaly installed
- ✅ __Built-in Theming support__
- 🟠 __Context-aware code completion__:  to get syntax highlighting & code completion, an editor extension is required
- ❌ __No Atomic CSS__

- __Styles output__
  - ❌ `.css` file extraction
  - ✅ `<style>` tag injection

- __Styles definition method(s)__
  - ✅ Tagged Templates
  - ✅ Style Objects

- __Styles usage method(s)__
  - ❌ `className`
  - ✅ `styled` component
  - 🟠 `css` prop

- 📈 __Higher Learning curve__: because you have to learn the API, get used to using the styled wrapper components, and basically a new way to manage your styles

<br />

#### Other worth mentioning observations

- 😍 provides __nesting__ selectors, so defining __pseudo classes__ and __media queries__ is a pleasure
- 🧐 the `css` prop is mentioned in the API docs, but there are no usage examples
- 🤓 need to split static & dynamic styles, otherwise it will render duplicate output
- 😕 bundles nested styles even if they are not used in component
- 😵 you can mix Tagged Templates with Styled Objects, which could lead to convoluted and different syntax for each approach (kebab vs camel, EOL character, quotes, interpolation, etc)
- 🥴 some more complex syntax appears to be a bit cumbersome to get it right (mixing animations, with Styled Objects, dynamic styles based on `Props` variations, etc)
- 🤫 for user input styles, it generates a new class name for each update, but it does NOT remove the old ones, appending indefinitely to the DOM

<br />

#### Conclusion

Styled components offers a novel approach to styling components using the `styled` method which creates a new component including the defined styles. You don't feel like writting CSS, so coming from CSS Modules you'll have to learn a new, more programatic way, to define styles. Because it allows both `string` and `object` syntax, it's a pretty flexibile solution both for migrating your existing styles, and for starting from scratch. Also, the maintainers did a pretty good job so far keeping up with most of the innovations in this field.

But before adopting it, you must be aware that it comes with a certain cost for your bundle size.

<br />

Page overhead: __+14.5 KB__

<br />

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

Version: __`11.1`__ | Maintained by [Mitchell Hamilton](https://twitter.com/mitchellhamiltn) & [others](https://opencollective.com/emotion#category-ABOUT) | Launched in __2017__ | [View Docs](https://emotion.sh/docs/introduction)


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

It appears to be a mature solution, with quite a number of users. The API is intuitive and very easy to use, great integration for React using hooks, love it. However, it lacks some modern features, especially TS support and code completion. The docs are also minimal, the information is spread in on various pages sometimes hard to find without a search feature, and the examples and use cases are not comprehensive.

- ❌ no code completion, although it uses style objects, but they are POJOs, so the IDE/Editor has no idea that "they should be camelCased CSS properties"
- ❌ no TS support (and the maintainer considers it a [low priority](https://github.com/robinweser/fela/issues/590#issuecomment-409373362))
- 🟠 bundles nested styles even if they are not used in component, but it's more difficult, cause nesting should not be used, and the atomic classes reduces this impact even more
- 🟠 it supports string based styles, but they are a second-class citizen
- 🟠 provides nesting selectors, but only with plugin (which adds even more to bundle)
- ✅ it has a low learning curve

**Observations**:
- very easy and simple to use API, intuitive
- found a way to use types for dynamic props, but it's not elegant, or very friendly
- creates very minimal and atomic class names, which it a great approach

```
Page                             Size     First Load JS
┌ ○ /                            3.46 kB        78.6 kB
├   /_app                        0 B            75.2 kB
├ ○ /404                         3.03 kB        78.2 kB
└ ○ /other                       2.06 kB        77.2 kB
+ First Load JS shared by all    75.2 kB
  ├ chunks/commons.7af247.js     13.1 kB
  ├ chunks/framework.37f4a7.js   42.1 kB
  ├ chunks/main.03531f.js        6.62 kB
  ├ chunks/pages/_app.f7ff86.js  12.6 kB
  └ chunks/webpack.50bee0.js     751 B
```

<br />

### Stitches

Very young solution, built and maintained by Modulz, very close to stable v1 release (as of Jan 13th 2021), is probably the most solid, modern and well-thought-out solution. The experience is just great, full TS support, a lot of other useful features baked in the lib. It identifies as "light-weight", but at 8KB it's debatable. Without a doubt, they took the best features from all other solutions and put them together for an awesome development experience. The documentation is exactly what you'd expect, no more, no less information (maybe missing the search feature).

- 🟠 it doesn't handle dynamic styles (can use built-in `variants` based on predefined types, or styles created inside the component to get access to the `props`, or inline styles for user defined styles)
- 🟠 bundles nested styles even if they are not used in component
- ✅ great DX, code completion out-of-the-box
- ✅ it has a pretty low learning curve
- ✅ built-in TypeScript support

**Observations**:
- uses `insertRule()` in development also, so you cannot see what gets bundled
- splits styles into atomic class names
- it generates a shitton of classes, it also expands short-hand properties (like `padding: 1em`), but maybe [atomic CSS-in-JS](https://sebastienlorber.com/atomic-css-in-js) scales better, and [Facebook is doing it](https://www.youtube.com/watch?v=9JZHodNR184) also
- does not support string styling with tagged templates (to reduce bundle size, as they say)
- but they support both `styled` & `css` approaches
- great design tokens management and usage
- very simple API, a pleasure to work with

```
Page                                                           Size     First Load JS
┌ ○ /                                                          2.42 kB        73.9 kB
├   /_app                                                      0 B            71.5 kB
├ ○ /404                                                       3.03 kB        74.5 kB
└ ○ /other                                                     959 B          72.4 kB
+ First Load JS shared by all                                  71.5 kB
  ├ chunks/1dfa07d0b4ad7868e7760ca51684adf89ad5b4e3.f723af.js  8.46 kB
  ├ chunks/commons.7af247.js                                   13.1 kB
  ├ chunks/framework.9d5241.js                                 41.8 kB
  ├ chunks/main.99ad68.js                                      6.62 kB
  ├ chunks/pages/_app.51b7a9.js                                832 B
  └ chunks/webpack.50bee0.js                                   751 B
```

<br />

### JSS

It appears to be a mature solution, with big docs and plugings. The API is intuitive and very easy to use, love it, great integration for React using hooks. However, it lacks some modern features, especially TS support and code completion.

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
- cannot nest media queries, which makes the syntax exactly the same as plain CSS

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

## Disregarded solutions

<br />

### Aphrodite

It's not a popular solution, the approach is similar to **React Native StyleSheets**  way of styling components. Has built-in TypeScript support and a simple API.

- global styles are a bit cumbersome to define
- no nesting support, apart from media queries & pseudo selectors
- no dynamic out-of-the-box support, so you have to get around that, like inline styles I guess, or like in React Native
- doesn't add any real value, except the ergonomics to colocate styles with the component.

### Glamor

I got it started with Next.js, but it feels fragile. The [Glamor official example](https://github.com/vercel/next.js/tree/canary/examples/with-glamor) throws an error regarding `rehydrate`. When commenting it out, it works, but not sure what the consequences are.

- it looks like an unmaintained or abandoned package
- documentation is so and so
- lacks any TS support
- has a lot of documented experimental features, marked as "buggy"
- it feels like a side/internal project at FB, that is not used anymore.

### Linaria

Didn't manage to start it with Next.js + TypeScript.

It was an interesting solution, as it promises zero-runtime overhead, generating `.css` files at build time, while the style are colocated within the components.

### Cxs

Didn't manage to start it with Next.js + TypeScript. The [official example](https://github.com/vercel/next.js/tree/canary/examples/with-cxs) uses version 3, while today we have version 6. The example doesn't work, because the API has changed.

The solution looked interesting, because it is supposed to be very light weight.

### Astroturf

Didn't manage to start it with Next.js + TypeScript. The [official example](https://github.com/vercel/next.js/tree/canary/examples/with-astroturf) uses an older version of Next.js.

The solution is not that popular, but it used `.css` extraction with colocated styles.

### Otion

Looks promising, atomic css and light-weight. It has a working [Next.js example](https://github.com/kripod/otion/tree/main/packages/example-nextjs), but we didn't consider it because it lacks any documentation.

### Styletron

It looks like a not so popular solution, which also lacks support for TypeScript. It looks like the maintainers work at Uber and they use it internally. It focused on generating unique atomic CSS classes, which could potentially deduplicate a lot of code.

### Radium

The projest was put in [Maintenance Mode](https://formidable.com/blog/2019/radium-maintenance/). They recommend other solutions.

### Glamorous

The project was [discountinued](https://github.com/paypal/glamorous/issues/419) in favor of Emotion.

<br />

## Motivation

The CSS language and CSS Modules technique have some limitations, some of them having altenative solutions, others just being "annoying" and "less ideal":

- **Styles cannot be co-located with components**  
  This can be cumbersome when authoring many small components. For large components/containers/pages/screens this isn't an issue, because you probably prefer to extract the styles in a separate file.

- **Styles usage is disconnected from their definition**  
  You get no IntelliSense with CSS modules, of what styles/classes are defined in the `.module.css` files, making **copy-paste** a required tool, lowering the DX.

- **Styles cannot access design tokens**  
  Any design tokens, defined in JS/TS cannot be directly used. We could inject them as [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), but we still don't get any IntelliSense. So, the only reasonable solution would be **inline styles**, which is less performant and also introduces another way to write styles (camelCase vs. kebab-case), while also splitting the styling in 2 different places.

<br />

## Goals

There are specific goals we're looking for, in order for the adoption of a CSS-in-JS solution to make sense:

- SSR support and easy integration with Next.js
- full TypeScript support
- great DX with code completion & highlight
- vendor prefixes
- low learning curve and intuitive API
- light-weight

<br />

Getting even more specific, we wanted to experience the usage of various solutions regarding:

- defining global styles
- using media queries
- dynamic styles based on component `props` (aka. component variants), or from user input
- bundle size impact

<br />

## Disclaimer

This analysis is intended to be **objective** and **unopinionated**.  
We don't work an any of these solutions, and have no intention, or motivation of _promoting_ or _trashing_ either of them.

<br />

👎 **What you WON'T FIND here?**  
- which solution is _"the best"_, or _"the fastest"_, as we'll not add any subjective grading
- what solution should you pick for your next project, because we have no idea what your goals are

<br />

👍 **What you WILL FIND here?**  
- an overview of (almost) all CSS-in-JS solutions available at this date (Jan 2021) that we've managed to integrate into a **Next.js v10 + TypeScript** empty project, with minimal effort
- a limited set of **quantitative** metrics that allowed us to evaluate these solutions, which might help you as well
- an additional list of **qualitative** personal observations, which might be either minor details or deal-breakers when choosing a particular solution

<br />

## Running the examples

Each implementation sits on their own branch, so we can have a clear separation at built time.

```bash
# install dependencies
yarn

# for development
yarn dev

# for production
yarn build
yarn start
```

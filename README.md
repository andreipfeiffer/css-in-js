# 🚧 [WIP DRAFT] CSS-in-TS research analysis

_Last update: **Jan 2021**_

This document is a thorough analysis of all the current **CSS-in-JS** solutions. The baseline is a **CSS modules** approach, and **Next.js** as a full-featured SSR framework for building resources with full **TypeScript** support.

The libraries are not presented in any particular order. If you're interested in a brief __history of CSS-in-JS__, you should checkout the [Past, Present, and Future of CSS-in-JS](https://www.youtube.com/watch?v=75kmPj_iUOA) talk by Max Stoiber.

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

|      | 1. Co&#8209;location | 2. DX | 3. `` tagged` ` `` | 4. `{ }` | 5. TS | 6. `.css` | 7. `<style>` | 8. Atomic | 9. Theme | 10. `className` | 11. `styled` | 12. `css` prop | 13. Learn | 14. Lib  | 15. Page |
| :--- | :------------------: | :---: | :----------------: | :------: | :---: | :-------: | :----------: | :-------: | :------: | :-------------: | :-----------: | :------------: | :-------: |     ---: |     ---: |
| [CSS Modules](#css-modules)             | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | 📉 | -        | -        |
| [Styled JSX](#styled-jsx)               | ✅ | 🟠 | ✅ | ❌ | 🟠 | ❌ | ✅ | ❌ | 🟠 | ✅ | ❌ | ❌ | 📉 |  +3.5 KB |  +4.4 KB |
| [Styled Components](#styled-components) | ✅ | 🟠 | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ | 🟠 | 📈 | +13.8 KB | +14.5 KB |
| [Emotion](#emotion)                     | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | 📉 |  +7.2 KB |  +7.7 KB |
| [Treat](#treat)                         | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | 📉 | -        | -        |
| [TypeStyle](#typestyle)                 | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | 🟠 | ✅ | ❌ | ❌ | 📈 |  +3.1 KB |  +3.7 KB |
| [Fela](#fela)                           | ✅ | 🟠 | 🟠 | ✅ | 🟠 | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | 📉 | +13.7 KB | +13.7 KB |
| [Stitches](#stitches)                   | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📉 |  +8.5 KB |  +9.0 KB |
| [JSS](#jss)                             | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | 🟠 | ❌ | 📉 | +19.0 KB | +20.0 KB |

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
3. **`` tagged` ` ``**: support for defining __styles as strings__
    - uses ES Tagged Templates and `kebab-case` for property names, just like plain CSS syntax
    - enables easier migration from plain CSS to CSS-in-JS, because you don't have to re-write your styles
    - requires additional code editor plugins for syntax highlight and code completion
    - usually implies slightly larger bundles and slower performance, because the strings must be parsed before
4. **`{ }`**: support for defining __styles as objects__
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
    - this generates a separate CSS class for each CSS property
    - you'll get larger HTML files, because each element will contain a large number of CSS classes applied
    - theoretically [atomic CSS-in-JS](https://sebastienlorber.com/atomic-css-in-js) reduces the scaling factor of your styles, [Facebook is doing it](https://www.youtube.com/watch?v=9JZHodNR184) as well
9. **Theme**: built-in support for Theming or managing design tokens/system
10. **`className`**: the API returns a string which you have to add to your component/element
    - similar how you would normally style React components, so it's easy to adopt because you don't have to learn a new approach
    - you'll probably have to use string concatenation, or interpolation, to combine styles
11. **`styled`**: the API creates a wrapper (styled) component which includes the `className`(s)
    - you'll have to learn a new way to define styles
    - it also introduces a bit of indiretion when figuring out what native element gets rendered
    - first introduced and popularized by Styled Components
12. **`css` prop**: allows passing styles using a special css prop, similar to inline styles
    - this is usually an additional feature for styled components, but it can also work separately
    - it's a nice and flexible ergonomic API
    - first introduced and popularized by Emotion v10
13. **Learn**: a slightly subjective opinion regarding the learning curve, you should really evaluate this on your own
14. **Lib**: size in KB of the library that is shipped in a production build
15. **Bundle**: the increase in KB compared to __CSS Modules__, for the entire index page production build
    - keep in mind that this includes an almost __empty page__, with only a couple of components
    - this is great for evaluating the minimal overhead, but does not offer any insight on the scaling factor: logarithmic, linear, or exponential

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

Basically, what you get is code removal when you delete the component, because the styles are colocated.

<br />

🟠 **Debugging / Inspecting**  
Most solutions inject the `<style>` tag in the DOM in `DEVELOPMENT`, which is a slower approach, but enables style inspecting using browser dev tools. But when building for `PRODUCTION`, they use [`CSSStyleSheet.insertRule()`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule) to inject the styles directly into the CSSOM, which is a way faster approach, but you cannot inspect the styles.
   - **JSS** and **Stitches** use `insertRule()` in dev mode as well, so you cannot see what gets injected
   - **TypeStyle** does NOT use `insertRule()`, not even in production

<br />

❌ **No component deduping**  
If the same component is imported by 2 different routes, it will be send twice to the client. This is surely a limitation of the bundler/build system, in our case Next.js, and __not related to the CSS-in-JS solution__. In Next.js, code-splitting works at the route level, bundling all components required for a specific route, but according to their [official blog](https://nextjs.org/blog/next-9-2#improved-code-splitting-strategy) and [web.dev](https://web.dev/granular-chunking-nextjs/) if a component is used in __more than 50%__ of the pages, it should be included in the `commons` bundle. However, in our example, we have 2 pages, each of them importing the `Button` component, and it's included in each page bundle, not in the `commons` bundle.

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
- 🟠 __TypeScript support__:  `@types` can be additionaly installed, but the API is too minimal to require TS
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

#### Other benefits

- 😌 out-of-the-box support with Next.js
- 👍 for user input styles, it generates a new class name for each change, but it removes the old one
- 😏 unlike CSS modules, you can target HTML `elements` also, and it generates unique class names for them

<br />

#### Worth mentioning observations

- 🤓 you'll need to optimize your styles by [splitting static & dynamic styles](https://github.com/vercel/styled-jsx#dynamic-styles), to avoid rendering duplicated styles
- 🤨 unique class names are added to elements, even if you don't target them in your style definition, resulting in un-needed slight html pollution
- 😕 it will bundle any defined styles, regardless if they are used or not, just like plain CSS
- 😢 cannot use __nesting__, so defining __pseudo classes__ or __media queries__ has the same downsides as plain CSS, requiring selectors/class names duplication

<br />

#### Conclusions

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
- ✅ __TypeScript support__:  `@types` must be additionaly installed, via DefinitelyTyped
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

#### Other benefits

- 😍 provides __nesting__ selectors, so defining __pseudo classes__ and __media queries__ is a pleasure

<br />

#### Worth mentioning observations

- 🧐 the `css` prop is mentioned in the API docs, but there are no usage examples
- 🤓 need to split static & dynamic styles, otherwise it will render duplicate output
- 😕 bundles nested styles even if they are not used in component
- 😵 you can mix Tagged Templates with Styled Objects, which could lead to convoluted and different syntax for each approach (kebab vs camel, EOL character, quotes, interpolation, etc)
- 🥴 some more complex syntax appears to be a bit cumbersome to get it right (mixing animations, with Styled Objects, dynamic styles based on `Props` variations, etc)
- 🤫 for user input styles, it generates a new class name for each update, but it does NOT remove the old ones, appending indefinitely to the DOM

<br />

#### Conclusions

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

Probably the most comprehensive, complete and sofisticated solution. Detailed documentation, fully built with TypeScript, looks very mature, rich in features and well maintained.

Version: __`11.1`__ | Maintained by [Mitchell Hamilton](https://twitter.com/mitchellhamiltn) & [others](https://opencollective.com/emotion#category-ABOUT) | Launched in __2017__ | [View Docs](https://emotion.sh/docs/introduction)

<br />

- ✅ __Styles/Component co-location__
- ✅ __TypeScript support__
- ✅ __Built-in Theming support__
- ✅ __Context-aware code completion__: if you use `styled` components approach, you must install an additional editor plugin
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
  - ✅ `css` prop

- 📉 __Low Learning curve__: when using the `css` prop, which is the primary approach, the API is pretty straightforward

<br />

#### Other benefits

- 😍 provides __nesting__ selectors, so defining __pseudo classes__ and __media queries__ is a pleasure
- 😎 the `css` prop is great ergonomic, however it seems to be a newer approach, based on React 17 new `jsx` runtime, and [configuring](https://emotion.sh/docs/css-prop) it is not trivial, differs on your setup, and implies some boilerplate (but this should change soon)

<br />

#### Worth mentioning observations

- 😕 bundles nested styles even if they are not used in component
- 🤫 for user input styles, it generates a new class name for each update, but it does NOT remove the old ones, appending indefinitely to the DOM
- 😑 using `styled` will add `3 KB` to you bundle, because it's imported from a separate package
- 🤔 don't know how to split static and dynamic styles, resulting in highly polluted duplicated styles in head for component variants (same applies to `css` prop & `styled` components)

<br />

#### Conclusions

Overall Emotion looks to be a very solid and flexible approach. The novel `css` prop approach offers great ergonomics for developers. Working with dynamic styles and TypeScript is pretty easy and intuitive. Supporting both `strings` and `objects` when defining styles, it can be easily used both when migrating from plain CSS, or starting from scratch. The bundle overhead is not negligible, but it's much smaller than other solutions, especially if you consider the rich set of features it offers.

<br />

Page overhead: __+7.7 KB__ (with `css` prop) and __+10.7 KB__ (with `styled` components)

<br />

```
Page                                                           Size     First Load JS
┌ ○ /                                                          2.47 kB        72.6 kB
├   /_app                                                      0 B            70.1 kB
├ ○ /404                                                       3.03 kB        73.1 kB
└ ○ /other                                                     1.04 kB        71.1 kB
+ First Load JS shared by all                                  70.1 kB
  ├ chunks/1dfa07d0b4ad7868e7760ca51684adf89ad5b4e3.19c2e4.js  7.1 kB
  ├ chunks/commons.800e6d.js                                   13.1 kB
  ├ chunks/framework.9d5241.js                                 41.8 kB
  ├ chunks/main.45755e.js                                      6.55 kB
  ├ chunks/pages/_app.398ef5.js                                832 B
  └ chunks/webpack.50bee0.js                                   751 B
```

<br />

### Treat

Modern solution with great TypeScript integration and no runtime overhead. It's pretty minimal in its features, straightforward and opinionated. Everything is processed at compile time, and it generates static CSS files, similar to CSS Modules, Linaria, or Astroturf.

Version: __`1.6`__ | Maintained by [Seek OSS](https://github.com/seek-oss/) | Launched in __2019__ | [View Docs](https://seek-oss.github.io/treat/)

<br />

- ✅ __TypeScript support__
- ✅ __Built-in Theming support__
- ✅ __Context-aware code completion__
- ❌ __No Styles/Component co-location__: styles must be placed in an external `.treat.ts` file
- ❌ __No Atomic CSS__

- __Styles output__
  - ✅ `.css` file extraction
  - ❌ `<style>` tag injection

- __Styles definition method(s)__
  - ❌ Tagged Templates
  - ✅ Style Objects

- __Styles usage method(s)__
  - ✅ `className`
  - ❌ `styled` component
  - ❌ `css` prop

- 📉 __Low Learning curve__: coming from CSS Modules it'll feel like home, the additional API required for variants is pretty straightforward and easy to learn

<br />

#### Other benefits

- 😍 supports __nesting__, so defining __pseudo classes__ and __media queries__ is a pleasure
- 👮 forbids __nested arbitrary selectors__ (ie: `& > span`), which might be seen as a downside, when it's actually discourages bad-practices, like __specificity wars__

<br />

#### Worth mentioning observations

- 😕 bundles styles even if they are not used in component
- 😥 it doesn't handle dynamic styles: you can use built-in `variants` based on predefined types, or __inline styles__ for user defined styles

<br />

#### Conclusions

When using Treat, you feel a lot like using CSS Modules: you need an external file for styles, you place the styles on the elements using `className`, you handle dynamic styles with __inline styles__, etc. However, you don't write CSS, and the overall experience with TypeScript support is magnificent, because everything is typed, you don't do any __copy-paste__, they have great error messages to help you not doing things you're not supposed to do.

The only thing to look out for is the limitation regarding dynamic styling. In highly interactive UIs that require user input styling, you'll have to use inline styles.

Treat is built with restrictions in mind, with a strong user-centric focus, balacing the developer experience with solid TypeScript support. It's also worth mentioning that [Mark Dalgleish](https://twitter.com/markdalgleish), co-author of CSS Modules, works at Seek and he's also a contributor.

<br />

Page overhead: __-__

<br />

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

Minimal library, focused only on type-checking. It is framework agnostic, that's why it doesn't have a special API for handling dynamic styles. There are 2 React wrappers available, but the typings feels a bit convoluted.

Version: __`2.1`__ | Maintained by [Basarat](https://twitter.com/basarat) | Launched in __2017__ | [View Docs](https://typestyle.github.io/)

<br />

- ✅ __Styles/Component co-location__
- ✅ __TypeScript support__
- ✅ __Context-aware code completion__
- 🟠 __Built-in Theming support__: uses TS `namespaces` to define theming, which is [not recommended](https://basarat.gitbook.io/typescript/project/namespaces) even by the author himself, or by TS core team member [Orta Therox](https://youtu.be/8qm49TyMUPI?t=1277).
- ❌ __No Atomic CSS__

- __Styles output__
  - ❌ `.css` file extraction
  - ✅ `<style>` tag injection

- __Styles definition method(s)__
  - ❌ Tagged Templates
  - ✅ Style Objects

- __Styles usage method(s)__
  - ✅ `className`
  - ❌ `styled` component
  - ❌ `css` prop

- 📈 __High Learning curve__: the API is simple, but it doesn't provide a lot of features, so you'll still need to do manual work and to re-adjust the way you'll author styles

<br />

#### Other benefits

- 😍 supports __nesting__, so defining __pseudo classes__ and __media queries__ is a pleasure

<br />

#### Worth mentioning observations

- 😕 bundles nested styles even if they are not used in component
- 😕 it doesn't handle dynamic styles, so you have to use regular JS functions to compute styles
- 🤨 when composing styles, you'll have to manually add some internal typings
- 🤔 don't know how to split dynamic and static styles, it's very easy to create duplicated generated code
- 😱 it creates a single `<style>` tag with all the styles, and replaces it on update, and apparently it doesn't use `insertRule()` which might be a performance drawback in large & highly dynamic UIs

<br />

#### Conclusions

Overall TypeStyle seems a minimal library, relatively easy to adopt because you don't have to rewrite your components, thanks to the classic `className` approach, but you have to rewrite your styles, because of the Style Object syntax. You don't feel like writting CSS, so there is a learning curve you need to get through.

With Next.js or React in general you don't get much value out-of-the-box, so you still need to perform a lot of manual work. The external [react-typestyle](https://github.com/Malpaux/react-typestyle) bindings don't support hooks, it seems to be an abandoned project and the typings are too convoluted to be considered an elegant solution.

<br />

Page overhead: __+3.7 KB__

<br />

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

It appears to be a mature solution, with quite a number of users. The API is intuitive and very easy to use, great integration for React using hooks, love it.

Version: __`11.5`__ | Maintained by [Robin Weser](https://twitter.com/robinweser) | Launched in __2016__ | [View Docs](https://fela.js.org/docs/)

<br />

- ✅ __Styles/Component co-location__
- ✅ __Built-in Theming support__
- ✅ __Atomic CSS__
- 🟠 __TypeScript support__: it exposes Flow types, which work ok
- 🟠 __Context-aware code completion__: styles defined outside the component require explicit typing to get code completion

- __Styles output__
  - ❌ `.css` file extraction
  - ✅ `<style>` tag injection

- __Styles definition method(s)__
  - 🟠 Tagged Templates
  - ✅ Style Objects

- __Styles usage method(s)__
  - ✅ `className`
  - ❌ `styled` component
  - ❌ `css` prop

- 📉 __Low Learning curve__: the API is simple, if you're used to hooks you'll get used to it in no time

<br />

#### Other benefits

- 😍 supports __nesting__, so defining __pseudo classes__ and __media queries__ is a pleasure
- 😌 easy and simple to use API, very intuitive if you're used to hooks
- 🥳 creates very short and atomic class names (like `a`, `b`, ...)
- 😎 it has a lot of plugins that can add many additional features (but will also increase bundle size)

<br />

#### Worth mentioning observations

- 😕 bundles nested styles even if they are not used in component
- 🤨 when defining styles outside the component, you'll have to explicitly add some internal typings to get code completion
- 🥺 there's no actual TS support and the maintainer considers it a [low priority](https://github.com/robinweser/fela/issues/590#issuecomment-409373362)
- 🤕 without TS support, we cannot get fully type-safe integration into Next.js + TS (there are [missing types from the definition file](https://twitter.com/pfeiffer_andrei/status/1349106486740475904))
- 🤔 the docs say it supports string based styles, but they are a second-class citizen and they seem to work only for global styles
- 😵 the docs are also minimal, the information is spread on various pages, sometimes hard to find without a search feature, and the examples and use cases are not comprehensive

<br />

#### Conclusions

Fela looks to be a mature solution, with active development. It introduces 2 great features which we enjoyed a lot. The first one is the basic principle that _"Style as a Function of State"_. Working with dynamic styles feels super natural and integrates perfectly with React's mindset. The second is atomic CSS class names, which should potentially scale great when used in large applications.

The lack of TS support however is a bummer, if you're looking for a fully type-safe solution. Also, the scaling benefits of atomic CSS should be measured against the library bundle size.

<br />

Page overhead: __+13.7 KB__

<br />

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

Very young library, is probably the most solid, modern and well-thought-out solution. The overall experience is just great, full TS support, a lot of other useful features baked in the lib.

Version: __`0.0.2`__ | Maintained by [Modulz](https://github.com/modulz) | Launched in __2020__ | [View Docs](https://stitches.dev/docs)

<br />

- ✅ __Styles/Component co-location__
- ✅ __TypeScript support__
- ✅ __Context-aware code completion__
- ✅ __Built-in Theming support__
- ✅ __Atomic CSS__

- __Styles output__
  - ❌ `.css` file extraction
  - ✅ `<style>` tag injection

- __Styles definition method(s)__
  - ❌ Tagged Templates
  - ✅ Style Objects

- __Styles usage method(s)__
  - ✅ `className`
  - ✅ `styled` component
  - ✅ `css` prop _(used only to override `styled` components)_

- 📉 __Low Learning curve__: the API is simple and intuitive, documentation is top-notch

<br />

#### Other benefits

- 😍 supports __nesting__, so defining __pseudo classes__ and __media queries__ is a pleasure
- 😌 easy and simple to use API, a pleasure to work with
- 😎 great design tokens management and usage
- 🥰 documentation is exactly what you'd expect, no more, no less

<br />

#### Worth mentioning observations

- 😕 bundles nested styles even if they are not used in component
- 😵 uses `insertRule()` in development also, so you cannot see what gets bundled
- 🤨 it expands short-hand properties, from `padding: 1em;` to `padding-top: 1em; padding-right: 1em; padding-bottom: 1em; padding-left: 1em;`
- 🤔 dynamic styles can be defined either using built-in `variants` (for predefined styles), or styles created inside the component to get access to the `props`
- 🧐 would help a lot to get the search feature inside the docs

<br />

#### Conclusions

Stitches is probably the most modern solution to this date, with full out-of-the-box support for TS. Without a doubt, they took the best features from all other solutions and put them together for an awesome development experience. The first thing that will impress you is definitely the documentation. The second, is the API they exposes which you cannot enjoy. The features they provide are not huge in quantity, but are very well-thought-out.

However, you cannot ignore the fact that it's still in beta. Also, the authors identify as "light-weight", but at 8KB it's worth debating. Nevertheless, we will keep our eyes open and follow its growth.

<br />

Page overhead: __+8.5 KB__

<br />

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

Probably the grandaddy around here, JSS is a very mature solution being the first of them, and still being maintained. The API is intuitive and very easy to use, great integration for React using hooks.

Version: __`10.5`__ | Maintained by [Oleg Isonen](https://twitter.com/oleg008) and [others](https://opencollective.com/jss#category-ABOUT) | Launched in __2016__ | [View Docs](https://cssinjs.org/)

<br />

- ✅ __Styles/Component co-location__
- ✅ __Built-in Theming support__
- ❌ __Atomic CSS__
- ❌ __TypeScript support__
- ❌ __Context-aware code completion__

- __Styles output__
  - ❌ `.css` file extraction
  - ✅ `<style>` tag injection

- __Styles definition method(s)__
  - ❌ Tagged Templates
  - ✅ Style Objects

- __Styles usage method(s)__
  - ✅ `className`
  - 🟠 `styled` component (_see details below_)
  - ❌ `css` prop

- 📉 __Low Learning curve__: the API is simple, if you're used to hooks you'll get used to it in no time

<br />

#### Other benefits

- 😌 easy and simple to use API, very intuitive if you're used to hooks
- 😎 it has a lot of plugins that can add many additional features (but will also increase bundle size)

<br />

#### Worth mentioning observations

- 😕 bundles nested styles even if they are not used in component
- 🥺 supports __nesting__ only for __pseudo classes__, not for __media queries__, which makes the syntax exactly the same as plain CSS
- 😬 provides nesting selectors, but only with additional plugin
- 🤔 `react-jss` uses className by default. There's also `styled-jss` that uses __Styled Components__ approach, but it has no types, and couldn't make it work on top of `react-jss`.
- 😖 global styles are cumbersome to setup, requires plugin, tried to mix the JSS setup docs, with the `react-jss` SSR setup docs, with the `plugin-globals` docs on usage, without any luck

<br />

#### Conclusions

The API is similar in many ways to React Native StyleSheets, while the hooks helper allows for easy dynamic styles definition. There are many plugins that can add a lot of features to the core functionality, but you should take a close look at the total bundle size, which is significant even with the bare minimum only.

Being the first CSS-in-JS solution built, it lacks many of the modern features that focuses on developer experience.

<br />

Page overhead: __+20.0 KB__

<br />

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
- able to nest media queries & pseudo selectors, but cannot nest arbitrary rules/selectors
- no dynamic out-of-the-box support, so you have to get around that, like inline styles I guess, or like in React Native
- doesn't add any real value, except the ergonomics to colocate styles with the component.

### Glamor

I got it started with Next.js, but it feels fragile. The [Glamor official example](https://github.com/vercel/next.js/tree/canary/examples/with-glamor) throws an error regarding `rehydrate`. When commenting it out, it works, but not sure what the consequences are.

- it looks like an unmaintained or abandoned package
- documentation is pretty minimal
- lacks any TS support
- has a lot of documented experimental features, marked as "buggy"
- it feels like a side/internal project at FB, that is not used anymore.

### Linaria

Didn't manage to start it with Next.js + TypeScript.

It was an interesting solution, as it promises zero-runtime overhead, generating `.css` files at build time, while the style are colocated within the components.

### Cxs

Didn't manage to start it with Next.js + TypeScript. The [official example](https://github.com/vercel/next.js/tree/canary/examples/with-cxs) uses version 3, while today we have version 6. The example doesn't work, because the API has changed.

The solution looked interesting, because it is supposed to be very light-weight.

### Astroturf

Didn't manage to start it with Next.js + TypeScript. The [official example](https://github.com/vercel/next.js/tree/canary/examples/with-astroturf) uses an older version of Next.js.

The solution is not that popular, but it was the first to use `.css` extraction with colocated styles.

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

The CSS language and CSS Modules approach have some limitations especially if you want to have solid and type-safe code. Some of these limitations having altenative solutions, others are just being "annoying" and "less ideal":

- **Styles cannot be co-located with components**  
  This can be frustrating when authoring many small components, but it's not a deal breaker. For large components/containers/pages/screens this isn't an actual issue, because you probably prefer to extract the styles in a separate file.

- **Styles usage is disconnected from their definition**  
  You get no IntelliSense with CSS Modules, of what styles/classes are defined in the `.module.css` files, making **copy-paste** a required tool, lowering the DX. It also makes refactoring very cumbersome, because of the lack of safety.

- **Styles cannot access design tokens**  
  Any design tokens, defined in JS/TS cannot be directly used in CSS. There are 2 workarouns for this issue, neither of them being elegant:
  1. We could inject them as [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), but we still don't get any IntelliSense or type-safety
  2. We could use **inline styles**, which is less performant and also introduces another way to write styles (camelCase vs. kebab-case), while also splitting the styling in 2 different places.

<br />

## Goals

There are specific goals we're looking for, in order for the adoption of a CSS-in-JS solution to make sense:

- SSR support and easy integration with Next.js
- full TypeScript support
- great DX with code completion & syntax highlight
- out-of-the-box vendor prefixes
- low learning curve and intuitive API
- light-weight

<br />

Getting even more specific, we wanted to experience the usage of various CSS-in-JS solutions regarding:

- defining global styles
- using media queries & pseudo classes
- dynamic styles based on component `props` (aka. component variants), or from user input
- bundle size impact

<br />

## Disclaimer

This analysis is intended to be **objective** and **unopinionated**:
- I don't work on any of these solutions, and have no intention or motivation of _promoting_ or _trashing_ either of them.  
- I have no prior experience with any CSS-in-JS solution, so I'm __not biased__ towards any of them. I've equally used all the solutions analyzed here.

<br />

👎 **What you WON'T FIND here?**  
- which solution is _"the best"_, or _"the fastest"_, as I'll not add any subjective grading, or performance metrics
- what solution should you pick for your next project, because I have no idea what your project is and what your goals are

<br />

👍 **What you WILL FIND here?**  
- an overview of (almost) all CSS-in-JS solutions available at this date (see _last update_ on top) that we've tried to integrate into a **Next.js v10 + TypeScript** empty project, with __minimal effort__;
- a limited set of **quantitative metrics** that allowed me to evaluate these solutions, which might help you as well;
- an additional list of **qualitative personal observations**, which might be either minor details or deal-breakers when choosing a particular solution.

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

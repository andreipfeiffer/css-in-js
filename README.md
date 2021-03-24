# A thorough analysis of CSS-in-TS

This document contains an in-depth analysis of all the current **CSS-in-JS** solutions, that support **Server Side Rendering** and **TypeScript**.

The baseline reference we'll use for comparison is a **CSS Modules** approach.  
We're using **Next.js** as a SSR framework for building resources.  
Last important aspect is type-safety with full **TypeScript** support.

<br />

> ✋ Please checkout our [goals](#goals) & [disclaimer](#disclaimer) before jumping to conclusions.

> 🗓 _Last update: **Mar 2021**_

<br />

## Table of contents

- [Motivation](#motivation)
- [Goals](#goals)
- [Disclaimer](#disclaimer)
- [**Overview**](#overview)
  - [Legend](#legend)
  - [Overall observations](#overall-observations)
- Libraries review
  - [**CSS Modules**](#css-modules)
  - [**Styled JSX**](#styled-jsx)
  - [**Styled Components**](#styled-components)
  - [**Emotion**](#emotion)
  - [**Treat**](#treat)
  - [**TypeStyle**](#typestyle)
  - [**Fela**](#fela)
  - [**Stitches**](#stitches)
  - [**JSS**](#jss)
  - [**Goober**](#goober)
  - [**Compiled**](#compiled)
- [Libraries not included](#libraries-not-included)
- [Running the examples](#running-the-examples)
- [Feedback and Suggestions](#feedback-and-suggestions)

<br />

## Motivation

The **CSS language** and **CSS Modules** have some limitations, especially if we want to have type-safe code. Some of these limitations have alterative solutions, others are just being _annoying_ or _less than ideal_:

1. **Styles cannot be co-located with components**  
  This can be frustrating when authoring many small components, but it's not a deal breaker. However, the experience of moving back-and-forth between the `component.js` file and the `component.css` file, searching for a given class name, and not being able to easily _"go to style definition"_, is an important productivity drawback.

2. **Styling pseudos and media queries requires selector duplication**  
  Another frustrating fact is the need to duplicate our CSS classes when defining __pseudo classes and elements__, or __media queries__. We can overcome these limitations using a CSS preprocessor like __SASS, LESS or Stylus__, that supports the `&` parent selector, enabling __contextual styling__.
  
    ```css
    .button {}

    /* duplicated selector declaration for pseudo classes/elements */
    .button:hover {}
    .button::after {}

    @media (min-width: 640px) {
      /* duplicated selector declaration inside media queries */
      .button {}
    }
    ```

3. **Styles usage is disconnected from their definition**  
  We get no IntelliSense with CSS Modules, of what CSS classes are defined in the `component.css` file, making **copy-paste** a required tool, lowering the DX. It also makes __refactoring very cumbersome__, because of the lack of safety.

4. **Using type-safe design tokens in CSS is non-trivial**  
  Any [design tokens](https://spectrum.adobe.com/page/design-tokens/) defined in JS/TS (to benefit from type-safety) cannot be directly used in CSS.
  
   There are at least 2 workarounds for this issue, neither of them being elegant:
   - We could inject them as [CSS Custom Properties / Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), but we still don't get any IntelliSense or type-safety when using them in `.module.css`.
   - We could use **inline styles**, which is less performant, and it also introduces a different way to write styles (camelCase vs. kebab-case), while also splitting the styling in 2 different places: the component file and the `.css` file.
   - We could use CSS (or SASS) as the source of truth for design tokens, by storing them as CSS Custom Properties and read them from JS using DOM queries, but we'd still need to manually update both the CSS and JS code when we perform any change, because we don't have type-safety when dealing with CSS;

<br />

## Goals

There are specific goals we're looking for with this analysis:

- 🥇 SSR support and easy integration with Next.js
- 🥇 full TypeScript support
- 🥇 great DX with code completion & syntax highlight
- 🥈 light-weight
- 🥈 comprehensive documentation
- 🥉 intuitive API and low learning curve

<br />

Getting even more specific, we wanted to experience the usage of various CSS-in-JS solutions regarding:

- defining __global styles__
- using __media queries__ & __pseudo classes__
- __dynamic styles__ based on component `props` (aka. component variants), or from user input
- __bundle size__ impact

<br />

## Disclaimer

This analysis is intended to be **objective** and **unopinionated**:
- I have not built my own CSS-in-JS library.
- I don't work on any of the libraries reviewed here.
- I have **no intention or motivation for _promoting_ or _trashing_** either of them.
- I have **no prior experience** with any CSS-in-JS solution, so I'm **not biased** towards any of them.
- I have **equally used** all the solutions analyzed here, which also means I have **no extensive experience** with any of them. So, you can safely say _I'm a jack of all ~~trades~~ CSS-in-JS libraries, but master of none_.

<br />

👎 **What you WON'T FIND here?**  
- which solution is _"the best"_, as I'll not add any grading, which would also be highly subjective;
- which solution is _"the fastest"_, as I'm not concearned about rendering performance metrics (you can checkout [Necholas's benchmarks](https://necolas.github.io/react-native-web/benchmarks/) for this);

<br />

👍 **What you WILL FIND here?**  
- an overview of (almost) all CSS-in-JS solutions available at this date (see _last update_ on top) that we've tried to integrate into a **Next.js v10 + TypeScript** empty project, with __minimal effort__;
- a limited set of **quantitative metrics** that allowed us to evaluate these solutions, which might help you as well;
- an additional list of **qualitative personal observations**, which might be either minor details or deal-breakers when choosing a particular solution.

The libraries are not presented in any particular order. If you're interested in a brief __history of CSS-in-JS__, you should checkout the [Past, Present, and Future of CSS-in-JS](https://www.youtube.com/watch?v=75kmPj_iUOA) insightful talk by Max Stoiber.

---

<br/>
<br/>

## Overview

|      | [1. Co&#8209;location](#1-co-location) | [2. DX](#2-dx) | [3. `` tag` ` ``](#3-tag-tagged-templates) | [4. `{ }`](#4--object-styles) | [5. TS](#5-ts) | [6. `&` ctx](#6--ctx-contextual-styles) | [7. Nesting](#7-nesting) | [8. Theme](#8-theming) | [9. `.css`](#9-css-static-css-extraction) | [10. `<style>`](#10-style-tag) | [11. Atomic](#11-atomic-css) | [12. `className`](#12-classname) | [13. `<Styled />`](#13-styled-) | [14. `css` prop](#14-css-prop) | [15. Agnostic](#15-framework-agnostic) | [16. Page size delta](#16-page-size-delta) |
| :--- | :------------------: | :---: | :-------------: | :------: | :---: | :--------: | :--------: | :------: | :-------: | :-----------: | :--------: | :-------------: | :----------: | :------------: | :-------: |     ---: |
| [CSS Modules](#css-modules)             | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | -                     |
| [Styled JSX](#styled-jsx)               | ✅ | 🟠 | ✅ | ❌ | 🟠 | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |  `+3.6 kB / +13.0 kB` |
| [Styled Components](#styled-components) | ✅ | 🟠 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | 🟠 | ❌ | `+13.9 kB / +39.0 kB` |
| [Emotion](#emotion)                     | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |  `+6.9 kB / +20.0 kB` |
| [Treat](#treat)                         | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |  `+0.3 kB /  -0.1 kB` |
| [TypeStyle](#typestyle)                 | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟠 | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |  `+2.8 kB / +19.0 kB` |
| [Fela](#fela)                           | ✅ | 🟠 | 🟠 | ✅ | 🟠 | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | `+12.6 kB / +45.0 kB` |
| [Stitches](#stitches)                   | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟠 | ❌ |  `+8.6 kB / +32.0 kB` |
| [JSS](#jss)                             | ✅ | 🟠 | 🟠 | ✅ | 🟠 | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | 🟠 | ❌ | ✅ | `+20.2 kB / +65.0 kB` |
| [Goober](#goober)                       | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | 🟠 | ✅ |  `+2.2 kB /  +7.0 kB` |
| [Compiled](#compiled)                   | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | 🟠 | ✅ | ✅ | ❌ |  `+2.0 kB /  +7.0 kB` |

<br />

### LEGEND:

- ✅ - full & out-of-the-box support
- 🟠 - partial or limited support, less than ideal, or requiring some additional manual work for full support
- ❌ - lack of support

<br />

#### 1. Co-location

The ability to define styles within the same file as the component. Note that we can also extract the styles into a separate file and import them, in case we prefer it.

[⬆️ to overview](#overview)

<br />

#### 2. DX

Refers to the **Developer eXperience** which includes 2 main aspects:

- **syntax highlighting** for styles definition;
- **code-completion/suggestions** for supported CSS Properties and available values (we're evaluating only the suggestion feature, not type-safety);

[⬆️ to overview](#overview)

<br />

#### 3. `` tag` ` `` (Tagged Templates)

Support for defining __styles as strings__, using ES Tagged Templates:

- uses `kebab-case` for property names, just like plain CSS syntax;
- enables easier migration from plain CSS to CSS-in-JS, because we don't have to completely re-write the styles;
- requires installing additional code editor plugin(s) for [syntax highlight and code completion](#2-dx), otherwise our code would look like a plain `string`;
- requires an additional step to parse the string and convert it to JS, which can be done either at built time (slower builds), or at runtime (slightly larger payload);

[⬆️ to overview](#overview)

<br />

#### 4. `{ }` (Object Styles)

Support for defining __styles as objects__, using plain JavaScript objects:

- uses `camelCase` for property names, like we would do in [React Native](https://reactnative.dev/docs/next/style);
- migrating existing CSS requires a complete rewrite (don't know how we could automate this);
- we don't need additional tooling for syntax highlighting, as we get it out-of-the-box, by writting JS objects;
- without proper TS definitions shipped with the library, we won't get code completion (☝️ we're only interested in TS, not Flow);

[⬆️ to overview](#overview)

<br />

#### 5. TS

TypeScript support, either built-in, or via `@types` package, which should include:

- typings for the library API;
- Style Object typings (in case the library supports the object syntax);
- `Props` generics, where applicable (get type-safe access to component props types when defining dynamic styles);

[⬆️ to overview](#overview)

<br />

#### 6. `&` ctx (Contextual Styles)

Support for __contextual styles__ allowing us to easily define __pseudo classes & elements__ and __media queries__ without the need to repeat the selector, as required in plain CSS:

- can either support the SASS/LESS/Stylus `&` parent selector;
- or provide any specific API or syntax to achieve the same result;

[⬆️ to overview](#overview)

<br />

#### 7. Nesting

Support for __arbitrary nested selectors__:

- this feature allows for great flexibility, which might be useful, or required in some specific use-cases;
- to keep in mind that it also introduces too many ways of defining styles, which might cause chaos if we want to enforce good-practices, scalability and maintainability;

[⬆️ to overview](#overview)

<br />

#### 8. Theming

Built-in support for Theming or managing tokens for a design system.  
We **haven't tested out this feature**, so we're only taking notes which libraries express their support in their docs.

[⬆️ to overview](#overview)

<br />

#### 9. `.css` (Static CSS extraction)

Defined styles are extracted as static `.css` files:
 
- it reduces the total bundle/page size, because we don't need additional runtime library, for injecting and evaluating the styles;
- this approach [affects **FCP/FMP**](#-performance-metrics) metrics negatively when users have an empty cache, and positively when having full cache;
- dynamic styling could potentially increase the generated file, because all style combinations must be pre-generated at built time;
- more suitable for less interactive solutions, where we serve a lot of different pages and we want to take advantage of cached styles (ie: e-commerce, blogs);

[⬆️ to overview](#overview)

<br />

#### 10. `<style>` tag

Defined styles are injected inside `<style>` tags in the document's `<head>`:

- makes dynamic styling super easy;
- incurs larger payload, because we're also shipping a runtime library to handle dynamic styles;
- when using SSR, styles required for the initial render are shipped twice to the client: once during SSR, and again during [hydration](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#rehydration-issues);
- more suited for highly dynamic and interactive (single page) applications;

[⬆️ to overview](#overview)

<br />

#### 11. Atomic CSS

The ability to generate **atomic css classes**, thus increasing style reusability, and reducing duplication:

- this generates a separate CSS class for each CSS property;
- we'll get larger HTML files, because each element will contain a larger number of CSS classes applied;
- theoretically [atomic CSS-in-JS](https://sebastienlorber.com/atomic-css-in-js) reduces the scaling factor of our styles, [Facebook is doing it](https://www.youtube.com/watch?v=9JZHodNR184) as well;
- it's debatable if the CSS total size reduction, is greater than the HTML size increase (what is the final delta)
- theoretically, if the class names are shorter than the CSS property definition, the delta is positive so we're shipping less bytes (also depends a lot on compression, so not easy to draw a definite conclusion);
- however, we're basically moving part of bytes from CSS to HTML, which might be harder to cache if we have dynamic SSRed pages;
- also, depends a lot on what changes more frequently: the styles? or the markup?

[⬆️ to overview](#overview)

<br />

#### 12. `className`

The library API returns a `string` which we have to add to our component or element;

- this is similar how we would normally style React components, so it's easy to adopt because we don't have to learn a new way of dealing with styles;
- to combine styles we have to use string concatenation;

[⬆️ to overview](#overview)

<br />

#### 13. `<Styled />`

The API creates a wrapper (or `Styled`) component which includes the generated `className`(s):

- this technique was first introduced and popularized by [Styled Components](#styled-components), hence the name;
- we'll have to learn a new way to define styles, because we're not applying styles to elements, instead we're creating new components that include the styled elements;
- this also introduces a bit of indiretion when figuring out what native elements gets rendered inside a larger component;
- we end up creating components like `StyledButton` or `StyledList` instead of constants like `button_styles` or `list_styles`, so regarding naming it's pretty much the same thing;
- since the styles/class names are not re-used (we re-use the entire component), it makes sense to encapsulate the styles within the component and not think about 2 different aspects of the same entity;
- it's not React specific, can also be used with [Vue](https://github.com/styled-components/vue-styled-components);

[⬆️ to overview](#overview)

<br />

#### 14. `css` prop

Allows passing styles using a special `css` prop, similar how we would define inline styles, but the library generates a unique CSS class name behind the scenes:

- it's a convenient and ergonomic API;
- this technique was first introduced and popularized by [Emotion](#emotion) v10;
- it's seems to be React specific

[⬆️ to overview](#overview)

<br />

#### 15. Framework agnostic

Allows usage without, or with any framework. Some libraries are built specifically for React only.  
**NOTE**: some libraries like **Stitches**, **Emotion**, or **Treat** document only React usage, although they have a **core** that's framework agnostic.

[⬆️ to overview](#overview)

<br />

#### 16. Page size delta

The total page size difference in kB (transferred gzipped & minified / uncompressed & minified) compared to __CSS Modules__, for the entire index page production build using Next.js:

- keep in mind that this includes an almost __empty page__, with only a couple of components;
- this is great for evaluating the minimal overhead, but does NOT offer any insight on the scaling factor: logarithmic, linear, or exponential;
- the values for the __runtime library__ are taken from Chrome Devtools Network tab, [Transferred over network vs Resource size](https://developers.google.com/web/tools/chrome-devtools/network/reference#uncompressed);

[⬆️ to overview](#overview)

<br/>

---

<br/>

### Overall observations

The following observations apply for all solutions (with minor pointed exceptions).

<br />

#### ✅ Code splitting

Components used only in a specific route will only be bundled for that route. This is something that Next.js performs out-of-the-box.

<br />

#### ✅ Global styles

All solutions offer a way to define global styles, some with a dedicated API.

- **Compiled** is the only library that doesn't have a dedicated API for global styles at the moment, but it is [planned](https://github.com/atlassian-labs/compiled/issues/62)

<br />

#### ✅ SSR

All solutions offer Server-Side Render support, and are easy to integrate with Next.js.

<br />

#### ✅ Vendor prefixes

All solutions automatically add vendor specific prefixes out-of-the-box.

<br />

#### ✅ Unique class names

All solutions generate unique class names, like CSS Modules do. The algorithm used to generate these names varies a lot between libraries:

- some libraries use a **hashing** algorithm, requiring more computing, but resulting in idempotent names (for example: `.heading` style from `Card` component will always have the `.Card_heading_h7Ys5` hash);
- other libraries use **counting**, basically incrementing either a number (`.heading-0-2-1`, `.input-0-2-2`), or the alphabet letters (`a, b, c, ... aa, ab, ac`, etc), making this approach more performant, but resulting in non-idempotent class names (can't figure out if this has any potential drawbacks or not);

<br />

#### ✅ No inline styles

None of the solutions generate inline styles, which is an older approach, used by Radium & Glamor. The approach is [less performant than CSS classes](https://esbench.com/bench/5908f78199634800a0347e94), and it's [not recommended](https://reactjs.org/docs/dom-elements.html#style) as a primary method for defining styles. It also implies using JS event handlers to trigger pseudo classes, as inline styles do not support them. Apparently, all modern solutions nowadays moved away from this approach.

<br />

#### ✅ Full CSS support

All solutions support most CSS properties that you would need: **pseudo classes & elements**, **media queries** and **keyframes** are the ones that we've tested.

<br />

#### ✅ Critical CSS extraction

Most solutions market themselves as being able to _**"extract critical CSS"**_ during SSR. Please note that this does **NOT refer** to [above-the-fold critical CSS extraction](https://web.dev/extract-critical-css/), as we initially thought.

What they actually do:
- during SSR, they only generate styles for the **visible** elements of the static rendered page;
- they don't inject CSS for elements that are dynamically rendered, or lazy loaded;

With 100% static CSS, there would be actually no benefit. With dynamic pages that render very few elements on the server, and most components are rendered dynamically on the client, the benefit increases.

All solutions support this feature:
- **Treat** is the only exception, because it extracts all styles as fully static `.css`;

<br />

#### 🟠 Performance Metrics

Understanding how these features affect [Core Web Vitals](https://web.dev/vitals/#core-web-vitals) and [Performance Metrics](https://web.dev/lighthouse-performance/#metrics) in general is an extremely important factor to consider, and the way styles are delivered to the client has probably the biggest impact, so let's analyse this in detail.

Also, there are 2 different scenarios we need to consider:

- 📭 **Empty cache**: the user visits our page for the first time, or a returning user visits our page after the cache was invalidated (a new version was released);
- 📬 **Full cache**: a returning user visits our page, and has all static resources cached (`.js`, `.css`, media, etc);

<br />

#### 1. `.css` file extraction  

Solutions that generate `.css` static files, which you normally would include as `<link>` tag(s) in the `<head>` of your page, are basically [rendering-blocking resources](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css). This highly affects **FCP**, **LCP** and any other metric that follows.

📭 **Empty cache**  
If the user has an empty cache, the following needs to happen, **negatively** impacting **FCP** and **LCP**:

- the browser needs to make an additional request, which implies a full **RTT** (Round Trip Time) to our server;
- transfer all CSS file content;
- parse it and build the CSSOM;
- these will delay any rendering of the `<body>`, even if the entire HTML is already loaded, and it may even be eagerly parsed, and some resources already fetched in advance;

It's true that you can fetch in **parallel** other `<head>` resources (additional `.css` or `.js` files), but this is generally a bad practice;

📬 **Full cache**  
However, on subsequent visits, the entire `.css` resource would be cached, so **FCP** and **LCP** would be positively impacted.

<br />

💡 **Key points**  
This solution appears to be better suited when:
- we have many Server Side Rendered pages that our users visit, maybe even containing a common `.css` file that can be cached when visiting other pages;
- we don't update the styles frequently, so they can be cached for longer periods of time;
- we want to optimize for returning visitors, affecting first-time visits instead;

<br />

#### 2. `<style>` tag injected styles

During **SSR**, styles will be added as `<style>` tag(s) in the `<head>` of the page. Keep in mind that these usually do NOT include all styles needed for the page, because most libraries perform [Critical CSS extraction](#-critical-css-extraction), so these `styles` should be usually smaller than the entire `.css` static file discussed previously.

📭 **Empty cache**  
Because we're shipping less CSS bytes, and they are inlined inside the `.html` file, this would result in faster **FCP** and **LCP**:

- we don't need additional requests for `.css` files, so the browser is not blocked;
- if we move all other `.js` files requests to the end of the document, `<head>` won't do any requests, so rendering will occur super fast;
- however, eventually we would ship additional bytes, that were not needed with static `.css` extraction:
   - the runtime library (between 1.6kB - 20kB);
   - the styles required for the page, bundled in `.js` files along with the components, during [hydration](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#rehydration-issues) (this includes all the critical CSS already shipped inside the `<style>` tag + others);
- all these files are required to be fetched, parsed and executed to get a **fully interactive** page;

📬 **Full cache**  
When the user's cache is full, the additional `.js` files won't require fetching, as they are already cached.  
However, if the page is **SSRed**, the inlined critical CSS rendered in the `<style>` tag of the document will be downloaded again, unless we deal with static HTML that can be cached as well, or we deal with HTML caching on our infrastructure.

But, by default, we will ship extra bytes on every page HTTP request, regardless if it's cached or not.

<br />

💡 **Key points**  
This solution appears to be better suited when:
- we deal with SPA (Single Page Applications), where we have one (or few) SSR pages;
- we update the styles frequently, so even if they could be cached, it won't have a positive impact;
- we want to optimize for first-time visitors, affecting returning visitors instead;

<br />

#### 🟠 Dead code removal

Most solutions say they _remove unused code/styles_. This is only **half-true**.

Unused code is indeed more difficult to accumulate, especially if you compare it to plain `.css` files as we used to write _a decade ago_. But when compared to CSS Modules, the differencies are not that big. Any solution that offers the option to define **arbitrary selectors** or **nested styles** will bundle them, regardless if they are used or not inside our component. We've managed to ship unused SSR styles with all the tested solutions.

True & full unused code removal is difficult to implement, as the CSS syntax is not type-checked, nor statically analyzable. Also, the dynamic nature of components make it practically impossible in certain scenarios, especially when the markup is dynamically rendered:
- `& span`: descendant elements;
- `&:nth-child()`: certain pseudo selectors;
- `& .bg-${color}`: dynamic selectors;
- `.parent &`: parent selectors;

Basically, what we get is code removal when we delete the component, or we don't import it anymore. That's implicit behaviour, because the styles are a direct dependency of the component. When the component is gone, so are its styles.

<br />

#### 🟠 Debugging / Inspecting

There are 2 methods to inject CSS into the DOM & update it from JavaScript:

<br />

##### 1. Using `<style>` tag(s)

This approach implies adding one or more `<style>` tag(s) in the DOM (either in the `<head>` or somewhere in the `<body>`), using [.appendChild()](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild) to add the `<style>` Node(s), in addition with either [.textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent), [.innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) to update the `<style>` tag(s).

- using this approach, we can easily _see_ what styles get added to the DOM, because we can inspect the DOM from our DevTools, like any other DOM Node;
- using only one `<style>` tag and updating its whole content, could be slow to update the entire DOM when we actually changed only a tiny set of CSS rule(s);
- most libraries use this solution in `DEVELOPMENT` mode, because it provides a better debugging experience;
   - **TypeStyle** uses this in `PRODUCTION` also;

<br />

##### 2. Using `CSSStyleSheet` API

First used by **JSS**, this method uses [`CSSStyleSheet.insertRule()`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule) to inject CSS rules directly into the **CSSOM**.

- using this approach it's a bit more difficult to _see_ what styles get injected into the CSSOM, because even if you see the CSS applied on the elements it will point to an empty `<style>` tag;
   - to see all the injected styles, you'll have to select the `<style>` tag;
   - get access to it via `$0` in Chrome DevTools (or get a reference to it in any other way, using the DOM API);
   - access `.sheet.cssRules` on the `<style>` tag to see the Array of CSS rules that it contains;
- this method is apparently more performant than the previous one, during dynamic styles update, so most libraries use this method in `PRODUCTION`;
   - performance gains apply only when adding new CSS rules, or updating existing ones (ie: dynamic styles update at runtime);
   - **JSS** and **Stitches** use it in `DEVELOPMENT` mode as well;

<br />

#### ❌ No component deduping

If the same component is imported by 2 different routes, it will be send twice to the client. This is surely a limitation of the bundler/build system, in our case Next.js, and __not related to the CSS-in-JS solution__.

In Next.js, code-splitting works at the route level, bundling all components required for a specific route, but according to their [official blog](https://nextjs.org/blog/next-9-2#improved-code-splitting-strategy) and [web.dev](https://web.dev/granular-chunking-nextjs/) if a component is used in __more than 50%__ of the pages, it should be included in the `commons` bundle. However, in our example, we have 2 pages, each of them importing the `Button` component, and it's included in each page bundle, not in the `commons` bundle. Since the code required for styling is bundled with the component, this limitation will impact the styles as well, so it's worth keeping this in mind.

<br />

#### ❌ Missing chunk

Some of the libraries are missing a separate `.js` chunk when building for production, which should contain the **runtime library code**. Instead, the runtime library seems to be included in the `_app.***.js` chunk, along with other code, making it a bit difficult to determine exactly the size of the runtime library.

This applies to [Fela](#fela), [Goober](#goober) and [Compiled](#compiled). I'm not sure [why is this happening](https://github.com/vercel/next.js/pull/22786#issuecomment-791925331), or how to avoid it. 

<br />

---

<br />

### CSS Modules

This is a well established, mature and solid approach. Without a doubt, it's a great improvement over BEM, SMACCS, OOCSS, or any other scalable CSS methodology to structure and organize our CSS, especially in component-based applications.

Launched in __2015__ | [Back to Overview](#overview)

<br />

- ✅ __Context-aware code completion__
- ✅ __Framework agnostic__
- ❌ __No Styles/Component co-location__
- ❌ __No TypeScript support__
- ❌ __No Atomic CSS__
- ❌ __No Theming support__

- __Styles definition method(s)__
  - ✅ plain CSS
  - ❌ Style Objects

- __Styles nesting__
  - ❌ Contextual styles: _(requires SASS, LESS or Stylus)_
  - ✅ Abitrary nesting

- __Styles apply method(s)__
  - ✅ `className`
  - ❌ `styled` component
  - ❌ `css` prop

- __Styles output__
  - ✅ `.css` file extraction
  - ❌ `<style>` tag injection

<br />

This is the baseline we'll consider when comparing all the following __CSS-in-JS__ solutions. Checkout the [motivation](#motivation) to better understand the limitations of this approach that we're trying to fill.

<br />

|                 | Transferred / gzipped | Uncompressed |
| :-------------- | --------------------: | -----------: |
| Runtime library |                     - |            - |
| Index page size |               71.5 kB |       201 kB |

<br />

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

<br/>

---

<br/>

### Styled JSX

Very simple solution, doesn't have a dedicated website for documentation, everything is on Github. It's not popular, but it is the built-in solution in Next.js.

Version: __`3.4`__ | Maintained by [Vercel](https://github.com/vercel) | Launched in __2017__ | [View Docs](https://github.com/vercel/styled-jsx) | ... [back to Overview](#overview)

<br />

- ✅ __Styles/Component co-location__
- 🟠 __Context-aware code completion__:  to get syntax highlighting & code completion, an editor extension is required
- 🟠 __TypeScript support__:  `@types` can be additionaly installed, but the API is too minimal to require TS
- ❌ __No Atomic CSS__
- ❌ __No Theming support__
- ❌ __Not Framework agnostic__

- __Styles definition method(s)__
  - ✅ Tagged Templates
  - ❌ Style Objects

- __Styles nesting__
  - ❌ Contextual styles
  - ✅ Abitrary nesting

- __Styles apply method(s)__
  - ✅ `className`
  - ❌ `styled` component
  - ❌ `css` prop

- __Styles output__
  - ❌ `.css` file extraction
  - ✅ `<style>` tag injection

<br />

#### Other benefits

- 😌 out-of-the-box support with Next.js
- 👍 for user input styles, it generates a new class name for each change, but it removes the old one
- 👌 it generates slightly smaller styles than the default CSS modules settings, probably due to shorter unique class names (you can see this in the difference between the runtime library size __3.9 kB__ and the page size increase, which I'd expect to be larger, but instead it's __3.6 kB__, this being tiny code base, so this delta might scale)

<br />

#### Worth mentioning observations

- 😏 unlike CSS modules, we can target HTML `elements` also, and it generates unique class names for them (not sure if it's a good practice, though)
- 🤓 we'll need to optimize our styles by [splitting static & dynamic styles](https://github.com/vercel/styled-jsx#dynamic-styles), to avoid rendering duplicated styles
- 🤨 unique class names are added to elements, even if we don't target them in our style definition, resulting in un-needed slight html pollution (optimizing this is cumbersome, and it's _a lot of work for little benefit_)
- 😕 it will bundle any defined styles, regardless if they are used or not, just like plain CSS
- 😢 there's no support for __contextual styles__, so defining __pseudo classes__ or __media queries__ has the same downsides as plain CSS, requiring selectors/class names duplication (a [SASS plugin](https://github.com/vercel/styled-jsx#css-preprocessing-via-plugins) is required to get this feature)

<br />

#### Conclusions

Overall, we felt like writting plain CSS, with the added benefit of being able to define the styles along with the component, so we __don't need an additional `.css` file__. Indeed, this is the philosophy of the library: supporting CSS syntax inside the component file. We can __use any JS/TS constants of functions__ with string interpolation. Working with __dynamic styles is pretty easy__ because it's plain JavaScript in the end. We get all these benefits at a very low price, with a pretty __small bundle overhead__.

The downsides are the overall experience of writting plain CSS. __Without nesting support__ pseudo classes/elements and media queries getting pretty cumbersome to manage.

<br />

|                 | Transferred / gzipped | Uncompressed |
| :-------------- | --------------------: | -----------: |
| Runtime library |                3.9 kB |      10.7 kB |
| Index page size |               75.1 kB |       214 kB |
| vs. CSS Modules |           __+3.6 kB__ |   __+13 kB__ |

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

<br/>

---

<br/>

### Styled Components

For sure one of the most popular and mature solutions, with good documentation. It uses Tagged Templates to defines styles by default, but can use objects as well. It also popularized the `styled` components approach, which creates a new component along with the defined styles.

Version: __`5.2`__ | Maintained by [Max Stoiber](https://twitter.com/mxstbr) & [others](https://opencollective.com/styled-components#category-ABOUT) | Launched in __2016__ | [View Docs](https://styled-components.com/docs) | ... [back to Overview](#overview)

<br />

- ✅ __Styles/Component co-location__
- ✅ __TypeScript support__:  `@types` must be additionaly installed, via DefinitelyTyped
- ✅ __Built-in Theming support__
- ✅ __Framework agnostic__
- 🟠 __Context-aware code completion__: requires an editor extension/plugin
- ❌ __No Atomic CSS__

- __Styles definition method(s)__
  - ✅ Tagged Templates
  - ✅ Style Objects

- __Styles nesting__
  - ✅ Contextual styles
  - ✅ Abitrary nesting

- __Styles apply method(s)__
  - ❌ `className`
  - ✅ `styled` component
  - 🟠 `css` prop

- __Styles output__
  - ❌ `.css` file extraction
  - ✅ `<style>` tag injection

<br />

#### Worth mentioning observations

- 🧐 the `css` prop is mentioned in the API docs, but there are no usage examples
- 🤓 we need to split static & dynamic styles, otherwise it will render duplicate output
- 😕 bundles nested styles even if they are not used in component
- 😵 we can mix Tagged Templates with Styled Objects, which could lead to convoluted and different syntax for each approach (kebab vs camel, EOL character, quotes, interpolation, etc)
- 🥴 some more complex syntax appears to be a bit cumbersome to get right (mixing animations with Styled Objects, dynamic styles based on `Props` variations, etc)
- 🤫 for user input styles, it generates a new class name for each update, but it does NOT remove the old ones, appending indefinitely to the DOM

<br />

#### Conclusions

Styled components offers a novel approach to styling components using the `styled` method which creates a new component including the defined styles. We don't feel like writting CSS, so coming from CSS Modules we'll have to learn a new, more programatic way, to define styles. Because it allows both `string` and `object` syntax, it's a pretty flexibile solution both for migrating our existing styles, and for starting a project from scratch. Also, the maintainers did a pretty good job keeping up with most of the innovations in this field.

However before adopting it, we must be aware that it comes with a certain cost for our bundle size.

<br />

|                 | Transferred / gzipped | Uncompressed |
| :-------------- | --------------------: | -----------: |
| Runtime library |               14.2 kB |      36.7 kB |
| Index page size |               85.4 kB |       240 kB |
| vs. CSS Modules |          __+13.9 kB__ |   __+39 kB__ |

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

<br/>

---

<br/>

### Emotion

Probably the most comprehensive, complete and sofisticated solution. Detailed documentation, fully built with TypeScript, looks very mature, rich in features and well maintained.

Version: __`11.1`__ | Maintained by [Mitchell Hamilton](https://twitter.com/mitchellhamiltn) & [others](https://opencollective.com/emotion#category-ABOUT) | Launched in __2017__ | [View Docs](https://emotion.sh/docs/introduction) | ... [back to Overview](#overview)

<br />

- ✅ __Styles/Component co-location__
- ✅ __TypeScript support__
- ✅ __Built-in Theming support__
- ✅ __Context-aware code completion__: for using the `styled` components approach, an additional editor plugin is required
- ✅ __Framework agnostic__
- ❌ __No Atomic CSS__

- __Styles definition method(s)__
  - ✅ Tagged Templates
  - ✅ Style Objects

- __Styles nesting__
  - ✅ Contextual styles
  - ✅ Abitrary nesting

- __Styles apply method(s)__
  - ❌ `className`
  - ✅ `styled` component
  - ✅ `css` prop

- __Styles output__
  - ❌ `.css` file extraction
  - ✅ `<style>` tag injection  

<br />

#### Other benefits

- 😎 the `css` prop offers great ergonomics during development, however it seems to be a newer approach, based on [React 17 new `jsx` transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html), and [configuring](https://emotion.sh/docs/css-prop) it is not trivial, differs on your setup, and implies some boilerplate (which should change soon and become easier)

<br />

#### Worth mentioning observations

- 😕 bundles nested styles even if they are not used in component
- 🤫 for user input styles, it generates a new class name for each update, but it does NOT remove the old ones, appending indefinitely to the DOM
- 😑 using `styled` approach will add `3 kB` to our bundle, because it's imported from a separate package
- 🤔 don't know how to split static and dynamic styles, resulting in highly polluted duplicated styles for component variants, specifically problematic for SSR (same applies to `css` prop & `styled` components)

<br />

#### Conclusions

Overall Emotion looks to be a very solid and flexible approach. The novel `css` prop approach offers great ergonomics for developers. Working with dynamic styles and TypeScript is pretty easy and intuitive. Supporting both `strings` and `objects` when defining styles, it can be easily used both when migrating from plain CSS, or starting from scratch. The bundle overhead is not negligible, but definitely much smaller than other solutions, especially if you consider the rich set of features that it offers.

It seems it doesn't have a dedicated focus on performance, but more on Developer eXperience. It looks like a perfect "well-rounded" solution.

<br />

|                 | Transferred / gzipped | Uncompressed |
| :-------------- | --------------------: | -----------: |
| Runtime library |                7.5 kB |      19.0 kB |
| Index page size |               78.4 kB |       221 kB |
| vs. CSS Modules |           __+6.9 kB__ |   __+20 kB__ |

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

<br/>

---

<br/>

### Treat

Modern solution with great TypeScript integration and no runtime overhead. It's pretty minimal in its features, straightforward and opinionated. Everything is processed at compile time, and it generates static CSS files, similar to CSS Modules, Linaria, or Astroturf.

Version: __`1.6`__ | Maintained by [Seek OSS](https://github.com/seek-oss/) | Launched in __2019__ | [View Docs](https://seek-oss.github.io/treat/) | ... [back to Overview](#overview)

<br />

- ✅ __TypeScript support__
- ✅ __Built-in Theming support__
- ✅ __Context-aware code completion__
- ✅ __Framework agnostic__
- ❌ __No Styles/Component co-location__: styles must be placed in an external `.treat.ts` file
- ❌ __No Atomic CSS__

- __Styles definition method(s)__
  - ❌ Tagged Templates
  - ✅ Style Objects

- __Styles nesting__
  - ✅ Contextual styles
  - ❌ Abitrary nesting

- __Styles apply method(s)__
  - ✅ `className`
  - ❌ `styled` component
  - ❌ `css` prop

- __Styles output__
  - ✅ `.css` file extraction
  - ❌ `<style>` tag injection

<br />

#### Other benefits

- 👮 forbids __nested arbitrary selectors__ (ie: `& > span`), which might be seen as a downside, but it actually discourages bad-practices like __specificity wars__, which should be avoided when scaling CSS (however, this is impossible to be statically type-checked without _pattern matching_, so it will throw a runtime exception)
- 🥳 generates the same filename hash on build, if styles haven't changes, meaning that end-users benefit of CSS cache-ing even when deploying new versions with component updates only (logic, or content), without styles updates

<br />

#### Worth mentioning observations

- 😕 bundles all styles, exported or not, even if they are not used in component
- 😥 it doesn't handle dynamic styles: you can use built-in `variants` based on predefined types, or __inline styles__ for user-defined styles

<br />

#### Conclusions

When using Treat, we felt a lot like using CSS Modules: we need an external file for styles, we place the styles on the elements using `className`, we handle dynamic styles with __inline styles__, etc. However, we don't write CSS, and the overall experience with TypeScript support is magnificent, because everything is typed, so we don't do any __copy-paste__. Error messages are very helpful in guiding us when we do something we're not supposed to do. It's also the only analyzed solution that __extracts styles as `.css` files__ at built time, which provides better caching (learn more about the [performance implications](#1-css-file-extraction)).

The only thing to look out for is the limitation regarding dynamic styling. In highly interactive UIs that require user input styling, we'll have to use inline styles.

Treat is built with restrictions in mind, with a strong user-centric focus, balacing the developer experience with solid TypeScript support. It's also worth mentioning that [Mark Dalgleish](https://twitter.com/markdalgleish), co-author of CSS Modules, works at Seek and he's also a contributor.

<br />

|                 | Transferred / gzipped | Uncompressed |
| :-------------- | --------------------: | -----------: |
| Runtime library |                     - |            - |
| Index page size |               71.8 kB |       200 kB |
| vs. CSS Modules |           __+0.3 kB__ |    __-1 kB__ |

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

<br/>

---

<br/>

### TypeStyle

Minimal library, focused only on type-checking. It is framework agnostic, that's why it doesn't have a special API for handling dynamic styles. There are React wrappers available, but the typings feels a bit convoluted.

Version: __`2.1`__ | Maintained by [Basarat](https://twitter.com/basarat) | Launched in __2017__ | [View Docs](https://typestyle.github.io/) | ... [back to Overview](#overview)

<br />

- ✅ __Styles/Component co-location__
- ✅ __TypeScript support__
- ✅ __Context-aware code completion__
- ✅ __Framework agnostic__
- 🟠 __Built-in Theming support__: uses TS `namespaces` to define theming, which is [not a recommended TS feature](https://basarat.gitbook.io/typescript/project/namespaces) even by the author himself, or by TS core team member [Orta Therox](https://youtu.be/8qm49TyMUPI?t=1277).
- ❌ __No Atomic CSS__

- __Styles definition method(s)__
  - ❌ Tagged Templates
  - ✅ Style Objects

- __Styles nesting__
  - ✅ Contextual styles
  - ✅ Abitrary nesting

- __Styles apply method(s)__
  - ✅ `className`
  - ❌ `styled` component
  - ❌ `css` prop

- __Styles output__
  - ❌ `.css` file extraction
  - ✅ `<style>` tag injection

<br />

#### Worth mentioning observations

- 😕 bundles nested styles even if they are not used in component
- 😕 it doesn't handle dynamic styles, so we have to use regular JS functions to compute styles
- 🤨 when composing styles, we'll have to manually add some internal typings
- 🤔 don't know how to split dynamic and static styles, so it's very easy to create duplicated generated code with dynamic styles, specifically problematic with SSR
- 😱 it creates a single `<style>` tag with all the styles, and replaces it on update, and apparently it doesn't use `insertRule()`, not even in production builds, which might be an important performance drawback in large & highly dynamic UIs

<br />

#### Conclusions

Overall TypeStyle seems a minimal library, relatively easy to adopt because we don't have to rewrite our components, thanks to the classic `className` approach. However we do have to rewrite our styles, because of the Style Object syntax. We didn't feel like writting CSS, so there is a learning curve we need to climb.

With Next.js or React in general we don't get much value out-of-the-box, so we still need to perform a lot of manual work. The external [react-typestyle](https://github.com/Malpaux/react-typestyle) binding doesn't support hooks, it seems to be an abandoned project and the typings are too convoluted to be considered an elegant solution.

<br />

|                 | Transferred / gzipped | Uncompressed |
| :-------------- | --------------------: | -----------: |
| Runtime library |                4.5 kB |       8.6 kB |
| Index page size |               74.3 kB |       210 kB |
| vs. CSS Modules |           __+2.8 kB__ |   __+19 kB__ |

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

<br/>

---

<br/>

### Fela

It appears to be a mature solution, with quite a number of users. The API is intuitive and very easy to use, great integration for React using hooks.

Version: __`11.5`__ | Maintained by [Robin Weser](https://twitter.com/robinweser) | Launched in __2016__ | [View Docs](https://fela.js.org/docs/) | ... [back to Overview](#overview)

<br />

- ✅ __Styles/Component co-location__
- ✅ __Built-in Theming support__
- ✅ __Atomic CSS__
- ✅ __Framework agnostic__
- 🟠 __TypeScript support__: it exposes Flow types, which work ok, from our (limited) experience
- 🟠 __Context-aware code completion__: styles defined outside the component require explicit typing to get code completion

- __Styles definition method(s)__
  - 🟠 Tagged Templates
  - ✅ Style Objects

- __Styles nesting__
  - ✅ Contextual styles
  - ✅ Abitrary nesting

- __Styles apply method(s)__
  - ✅ `className`
  - ❌ `styled` component
  - ❌ `css` prop

- __Styles output__
  - ❌ `.css` file extraction
  - ✅ `<style>` tag injection

<br />

#### Other benefits

- 😌 easy and simple to use API, very intuitive
- 🥳 creates very short and atomic class names (like `a`, `b`, ...)
- 😎 it has a lot of plugins that can add many additional features (but will also increase bundle size)

<br />

#### Worth mentioning observations

- 😕 bundles nested styles even if they are not used in component
- 🤨 when defining styles outside the component, we have to explicitly add some internal typings to get code completion
- 🥺 there's no actual TS support and the maintainer considers it a [low priority](https://github.com/robinweser/fela/issues/590#issuecomment-409373362)
- 🤕 without TS support, we cannot get fully type-safe integration into Next.js + TS (there are [missing types from the definition file](https://twitter.com/pfeiffer_andrei/status/1349106486740475904))
- 🤔 the docs say it supports string based styles, but they are a second-class citizen and they seem to work only for global styles
- 😵 some information in the docs is spread on various pages, sometimes hard to find without a search feature, and the examples and use cases are not comprehensive

<br />

#### Conclusions

Fela looks to be a mature solution, with active development. It introduces 2 great features which we enjoyed a lot. The first one is the basic principle that _"Style as a Function of State"_ which makes working with dynamic styles feel super natural and integrates perfectly with React's mindset. The second is atomic CSS class names, which should potentially scale great when used in large applications.

The lack of TS support however is a bummer, considering we're looking for a fully type-safe solution. Also, the scaling benefits of atomic CSS should be measured against the library bundle size.

<br />

|                 |     Transferred / gzipped |              Uncompressed |
| :-------------- | ------------------------: | ------------------------: |
| Runtime library | [???](#-missing-chunk) kB | [???](#-missing-chunk) kB |
| Index page size |                   84.1 kB |                    246 kB |
| vs. CSS Modules |              __+12.6 kB__ |                __+45 kB__ |

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

<br/>

---

<br/>

### Stitches

Very young library, probably the most solid, modern and well-thought-out solution. The overall experience is just great, full TS support, a lot of other useful features baked in the lib.

Version: __`0.0.2`__ | Maintained by [Modulz](https://github.com/modulz) | Launched in __2020__ | [View Docs](https://stitches.dev/docs) | ... [back to Overview](#overview)

<br />

- ✅ __Styles/Component co-location__
- ✅ __TypeScript support__
- ✅ __Context-aware code completion__
- ✅ __Built-in Theming support__
- ✅ __Atomic CSS__
- ❌ __Not Framework agnostic__: there is a `@stitches/core` package, but only React is supported at the moment

- __Styles definition method(s)__
  - ❌ Tagged Templates
  - ✅ Style Objects

- __Styles nesting__
  - ✅ Contextual styles
  - ✅ Abitrary nesting

- __Styles apply method(s)__
  - ✅ `className`
  - ✅ `styled` component
  - 🟠 `css` prop _(used only to override `styled` components)_

- __Styles output__
  - ❌ `.css` file extraction
  - ✅ `<style>` tag injection

<br />

#### Other benefits

- 😌 easy and simple to use API, a pleasure to work with
- 😎 great design tokens management and usage
- 🥰 documentation is exactly what we'd expect: no more, no less

<br />

#### Worth mentioning observations

- 😕 bundles nested styles even if they are not used in component
- 😵 uses `insertRule()` in development also, so we cannot see what gets bundled
- 🤨 it expands short-hand properties, from `padding: 1em;` will become `padding-top: 1em; padding-right: 1em; padding-bottom: 1em; padding-left: 1em;`
- 🤔 dynamic styles can be defined either using built-in `variants` (for predefined styles), or styles created inside the component to get access to the `props`
- 🧐 would help a lot to get the search feature inside the docs

<br />

#### Conclusions

Stitches is probably the most modern solution to this date, with full out-of-the-box support for TS. Without a doubt, they took some of the best features from other solutions and put them together for an awesome development experience. The first thing that impressed us was definitely the documentation. The second, is the API they expose which is close to top-notch. The features they provide are not huge in quantity, but are very well-thought-out.

However, we cannot ignore the fact that it's still in beta. Also, the authors identify it as "light-weight", but at __8 kB__ it's worth debating. Nevertheless, we will keep our eyes open and follow its growth.

<br />

|                 | Transferred / gzipped | Uncompressed |
| :-------------- | --------------------: | -----------: |
| Runtime library |                8.9 kB |      29.5 kB |
| Index page size |               80.1 kB |       233 kB |
| vs. CSS Modules |           __+8.6 kB__ |   __+32 kB__ |

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

<br/>

---

<br/>

### JSS

Probably the grandaddy around here, JSS is a very mature solution being the first of them, and still being maintained. The API is intuitive and very easy to use, great integration for React using hooks.

Version: __`10.5`__ | Maintained by [Oleg Isonen](https://twitter.com/oleg008) and [others](https://opencollective.com/jss#category-ABOUT) | Launched in __2014__ | [View Docs](https://cssinjs.org/) | ... [back to Overview](#overview)

<br />

- ✅ __Styles/Component co-location__
- ✅ __Built-in Theming support__
- ✅ __Framework agnostic__
- ❌ __No Atomic CSS__
- 🟠 __TypeScript support__ _([definition files](https://github.com/cssinjs/jss/blob/master/packages/react-jss/src/index.d.ts) exist, but for some reason, they [don't work](https://github.com/andreipfeiffer/css-in-js/issues/9#issuecomment-774125968))_
- 🟠 __Context-aware code completion__ _(Object Styles didn't work for us, due to lack of TS support)_

- __Styles definition method(s)__
  - 🟠 Tagged Templates: _(available with additional [plugin](https://cssinjs.org/jss-plugin-template?v=v10.5.1), with limited features)_
  - ✅ Style Objects

- __Styles nesting__
  - ✅ Contextual styles
  - ✅ Abitrary nesting

- __Styles apply method(s)__
  - ✅ `className`
  - 🟠 `styled` component _(available with additional [plugin](https://cssinjs.org/styled-jss?v=v2.2.3))_
  - ❌ `css` prop

- __Styles output__
  - ❌ `.css` file extraction
  - ✅ `<style>` tag injection

<br />

#### Other benefits

- 😌 easy and simple to use API, very intuitive
- 😎 it has a lot of plugins that can add many additional features (but will also increase bundle size)

<br />

#### Worth mentioning observations

- 😕 bundles nested styles even if they are not used in component
- 😳 keep in mind that [`react-jss` package](https://github.com/cssinjs/jss/blob/master/packages/react-jss/package.json#L47), which is used with React/Next.js, depends on [jss-preset-default](https://cssinjs.org/jss-preset-default), which includes many [plugins](https://github.com/cssinjs/jss/blob/master/packages/jss-preset-default/package.json#L35-L47) by default, so you don't need to manually add some of the plugins;
- 🤔 `react-jss` uses className by default. There's also `styled-jss` that uses __Styled Components__ approach, but it has no types, and couldn't make it work on top of `react-jss`;
- 😤 global styles were frustrating to setup, we've finally managed to used them thanks to [StackOverFlow](https://stackoverflow.com/questions/54201412/how-can-i-add-style-to-the-body-element-with-jss), because the docs have no mention of `injectSheet` API (or we couldn't find it anywhere);
- 😖 the docs are generally difficult to follow, and finding the information you need is a cumbersome process:
   - there is no search;
   - there are a lot of plugins, so you don't know where to look for a particular feature;
   - some plugins influence other plugins, or other docs pages, and they sometimes don't contain all the combinations of features, so the docs are not comprehensive (ie: we had to figure out on our own how to use **contextual styles** with **media queries**).

<br />

#### Conclusions

The API is similar in many ways to React Native StyleSheets, while the hooks helper allows for easy dynamic styles definition. There are many plugins that can add a lot of features to the core functionality, but attention must be payed to the total bundle size, which is significant even with the bare minimum only.

Also, being the first CSS-in-JS solution built, it lacks many of the modern features that focuses on developer experience.

<br />

|                 | Transferred / gzipped | Uncompressed |
| :-------------- | --------------------: | -----------: |
| Runtime library |               19.3 kB |      58.7 kB |
| Index page size |               91.7 kB |       266 kB |
| vs. CSS Modules |          __+20.2 kB__ |   __+65 kB__ |

<br />

```
Page                                                           Size     First Load JS
┌ ○ /                                                          2.42 kB        85.9 kB
├   /_app                                                      0 B            83.4 kB
├ ○ /404                                                       3.03 kB        86.5 kB
└ ○ /other                                                     969 B          84.4 kB
+ First Load JS shared by all                                  83.4 kB
  ├ chunks/1dfa07d0b4ad7868e7760ca51684adf89ad5b4e3.c41897.js  18.9 kB
  ├ chunks/commons.f6669c.js                                   13.1 kB
  ├ chunks/framework.37f4a7.js                                 42.1 kB
  ├ chunks/main.c73430.js                                      6.62 kB
  ├ chunks/pages/_app.fb643d.js                                2 kB
  └ chunks/webpack.245f04.js                                   751 B
```

<br/>

---

<br/>

### Goober

A very light-weight solution, with a loads of features.

Version: __`2.0`__ | Maintained by [Cristian Bote](https://twitter.com/cristianbote_) | Launched in __2019__ | [View Docs](https://goober.js.org/) | ... [back to Overview](#overview)

<br />

- ✅ __Styles/Component co-location__
- ✅ __Built-in Theming support__
- ✅ __TypeScript support__
- ✅ __Context-aware code completion__
- ✅ __Framework agnostic__
- ❌ __No Atomic CSS__

- __Styles definition method(s)__
  - ✅ Tagged Templates
  - ✅ Style Objects

- __Styles nesting__
  - ✅ Contextual styles
  - ✅ Abitrary nesting

- __Styles apply method(s)__
  - ✅ `className`
  - ✅ `styled` component (_see details below_)
  - 🟠 `css` prop (_is supported, but requires a separate babel plugin_)

- __Styles output__
  - ❌ `.css` file extraction
  - ✅ `<style>` tag injection

<br />

#### Other benefits

- 🤏 really tiny
- 😎 it supports a very wide range of defining styles, so it's pretty versatile and full featured in this regard (however, I fear that having all these options, a large team could mix various ways of defining styles, so it's more difficult to _enforce consistency_)

<br />

#### Worth mentioning observations

- 😕 bundles nested styles even if they are not used in component
- 🤫 for user input styles, it generates a new class name for each update, but it does NOT remove the old ones, appending indefinitely to the DOM
- 🤔 don't know how to split static and dynamic styles, resulting in highly polluted duplicated styles for component variants, specifically problematic for SSR
- 😱 it creates a single `<style>` tag with all the styles, and appends to it on update, and apparently it doesn't use `insertRule()`, not even in production builds, which might be an important performance drawback in large & highly dynamic UIs

<br />

#### Conclusions

Looking at Goober you cannot ask yourself what kind of magic did Cristian Bote do to fit all the features inside this tiny library. It is really mind blowing. It is marketed as being _"less than 1KB"_, which is not entirely accurate, but still... it's the smallest library we've tested.

<br />

|                 |     Transferred / gzipped |              Uncompressed |
| :-------------- | ------------------------: | ------------------------: |
| Runtime library | [???](#-missing-chunk) kB | [???](#-missing-chunk) kB |
| Index page size |                   73.7 kB |                    208 kB |
| vs. CSS Modules |               __+2.2 kB__ |                 __+7 kB__ |

<br />

```
Page                             Size     First Load JS
┌ ○ /                            3.89 kB        68.4 kB
├   /_app                        0 B            64.6 kB
├ ○ /404                         3.03 kB        67.6 kB
└ ○ /other                       2.49 kB          67 kB
+ First Load JS shared by all    64.6 kB
  ├ chunks/commons.7af247.js     13.1 kB
  ├ chunks/framework.9d5241.js   41.8 kB
  ├ chunks/main.03531f.js        6.62 kB
  ├ chunks/pages/_app.8a4776.js  2.37 kB
  └ chunks/webpack.50bee0.js     751 B
```

<br/>

---

<br/>

### Compiled

A rather new library, having the huge Attlasian platform supporting and probably using it. Many existing features, even more in development, or planned for development.

Version: __`0.6`__ | Maintained by [Attlasian](https://github.com/atlassian-labs) | Launched in __2020__ | [View Docs](https://compiledcssinjs.com/docs/) | ... [back to Overview](#overview)

<br />

- ✅ __Styles/Component co-location__
- ✅ __TypeScript support__
- ✅ __Context-aware code completion__
- ✅ __Atomic CSS__
- ❌ __Not Framework agnostic__
- ❌ __No Built-in Theming support__ _(at least at the moment, but it is [planned](https://github.com/atlassian-labs/compiled/issues/18))_

- __Styles definition method(s)__
  - ✅ Tagged Templates
  - ✅ Style Objects

- __Styles nesting__
  - ✅ Contextual styles
  - ✅ Abitrary nesting

- __Styles apply method(s)__
  - 🟠 `className` _(only supported with a custom [ClassNames](https://compiledcssinjs.com/docs/class-names) component)_
  - ✅ `styled` component
  - ✅ `css` prop

- __Styles output__
  - ❌ `.css` file extraction _(currently under development, will be shipped in 2021)_
  - ✅ `<style>` tag injection

<br />

#### Other benefits

- 😌 using the `css` prop is seemless and trivial, not requiring any special setup, unlike Emotion

<br />

#### Worth mentioning observations

- 🧐 styles are not placed in the `<head>` during SSR, instead they are placed right before the element using them in the `<body>`, which could potentially provide slightly faster Paint metrict, such as FCP, or LCP, because the browser can start rendering the body faster and incrementally, not waiting for the entire block of styles to be parsed
- 😕 bundles nested styles even if they are not used in component
- 😔 currently has no API for global styles, but it is [planned](https://github.com/atlassian-labs/compiled/issues/62) to be added
- 😳 `ClassNames` API, which enables us to apply styles as class name strings, is a bit convoluted and weird at first sight.

<br />

#### Conclusions

Compiled is a very promising library. Considering that it offers both atomic CSS, and it plans to support static `.css` extraction, with excelent TypeScript support and style co-location, it would be quite unique (having only [style9](#style9) as a direct competitor).

Also, we cannot ignore that is has Attlasian supporting its development, which puts a (slightly) bigger weight on the confidence level.

The total bundle overhead is pretty small, the runtime library being quite light-weight. With static `.css` file extraction, this could potentially become even smaller.

<br />

|                 |     Transferred / gzipped |              Uncompressed |
| :-------------- | ------------------------: | ------------------------: |
| Runtime library | [???](#-missing-chunk) kB | [???](#-missing-chunk) kB |
| Index page size |                   73.5 kB |                    208 kB |
| vs. CSS Modules |               __+2.0 kB__ |                 __+7 kB__ |

<br />

```
Page                              Size     First Load JS
┌ ○ /                             4.16 kB        66.9 kB
├   /_app                         0 B            62.7 kB
├ ○ /404                          3.03 kB        65.8 kB
└ ○ /other                        2.78 kB        65.5 kB
+ First Load JS shared by all     62.7 kB
  ├ chunks/commons.7af247.js      13.1 kB
  ├ chunks/framework.9d5241.js    41.8 kB
  ├ chunks/main.03531f.js         6.62 kB
  ├ chunks/pages/_app.c413ef.js   558 B
  ├ chunks/webpack.50bee0.js      751 B
  └ css/d9aac052842a915b5cc7.css  325 B
```

<br />

## Libraries not included

We know there are a lot of other libraries out there, besides the ones covered above. We're only covered the ones that have support for **React**, support for **SSR**, an easy integration with **Next.js**, good **documentation** and a sense of ongoing **support and maintenance**. Please checkout our [goals](#goals).

<br />

### style9

[Style9](https://github.com/johanholmerin/style9) is a new library, inspired by Facebook's own CSS-in-JS solution called stylex. Style9 is unique because it's the only open source library that supports both `.css` static extraction + atomic CSS, and/or styles co-location. It has TS support and easy to integrate with Next.js.

However, it has quite a few limitations (at least as of Feb 2021) that makes it practically unusable in a real production application that we would want to scale, both in code & team size:

- cannot use design tokens defined as `Enum` or `POJO`, only constant primitives are supported, which is a **big deal breaker**;
- dynamic styles are not trivial:
   - it supports styles toggling, similar to `classNames` lib, but not dynamically/computed/expression based;
   - for user styles, so we have to use inline styles;
   - there is an experimental addon [style9-components](https://github.com/johanholmerin/style9-components.macro) that tries to solve this;
- no global styles support;
- no theming support (not a deal breaker for us):
   - there is some exploration in this regard, with [style9-theme](https://github.com/johanholmerin/style9-theme.macro);
- documentation is not comprehensive, it contains a lot of code comments, without code examples, making it even more difficult to follow & understand

Some upsides:
- it's the first lib we've tested that actually doesn't bundle unused styles;
- it doesn't allow arbitrary seletors / nesting, which is a good thing, because it enforces good practices and consistency;
- it is framework agnostic;

As a conclusion, it wants to be a powerful solution with very interesting and unique set of features, but it's not mature yet. As far as we see, it's currently mostly designed towards more static solutions. Dynamic styling seems to be difficult to handle, at least for the moment.

<br />

### Tailwind

Not an actual CSS-in-JS library, more like a replacement for traditional CSS styling. It uses atomic CSS classes (some of them having multiple properties) that we attach to html elements. We don't write CSS, instead we use a different DSL to specify styles, pseudo classes, media queries, etc.

The reason we didn't include it in our thorough review is because it doesn't fully meet our [goals](#goals):
- it doesn't provide TS support, or type-safety
  - we cannot use out own design tokens from `.ts` files to include them in `tailwind.config` (cannot `import` any file, cannot require `.ts`)
  - using `tailwind.config` directly offers no type-safety when importing it, or using [`resolveConfig`](https://tailwindcss.com/docs/configuration#referencing-in-java-script)
  - there is a [PR on Definitely Typed](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/50921), but we're not sure if it will support the custom config, as well
  - there might be workarounds, but these are just proofs that there isn't a clean way to achieve this
- dynamic styles have some limitations: we have to be aware of [purging](https://tailwindcss.com/docs/optimizing-for-production#writing-purgeable-html) to not get missing design tokens in production builds
- we have to learn a new DSL: some style are similar and easy to deduce from their CSS counterparts, others are pretty different, and we have to learn (`rounded`, `place-self/content`, `divide`, `ring`)
- some advanced CSS features, like [`::after` pseudo elements](https://github.com/tailwindlabs/tailwindcss/discussions/2119) are tricky
- there are libraries like [xwind](https://github.com/Arthie/xwind) which integrates Tailwind with CSS-in-JS solutions, which is supports our theory that Tawilwind is not a replacement for CSS-in-JS, not does it address the same problems

Some upsides:
- we don't write CSS, which is indeed difficult to master
- the entire team uses the same "styling system"
- a shitton of predefined design tokens, plus the ability to customize them
- successfully bundles only used styles, doesn't bundle all classes defined in `tailwind.config`
   - exception: keyframe animations (spin, ping, etc)
   - beware of purging
   
Tailwind seems to be more than a _styling tool_, it also offers some out-of-the-box utils + a ready-made design system that you can use right away.


<br />

### Aphrodite

It's not a popular solution, the approach is similar to **React Native StyleSheets**  way of styling components. Has built-in TypeScript support and a simple API.

- global styles are a bit cumbersome to define
- able to nest media queries & pseudo selectors, but cannot nest arbitrary rules/selectors
- no dynamic out-of-the-box support, so we have to get around that, like inline styles I guess, or like in React Native
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

It was an interesting solution, as it promises zero-runtime overhead, generating `.css` files at build time, while the style are collocated within the components.

### Cxs

Didn't manage to start it with Next.js + TypeScript. The [official example](https://github.com/vercel/next.js/tree/canary/examples/with-cxs) uses version 3, while today we have version 6. The example doesn't work, because the API has changed.

The solution looked interesting, because it is supposed to be very light-weight.

### Astroturf

Didn't manage to start it with Next.js + TypeScript. The [official example](https://github.com/vercel/next.js/tree/canary/examples/with-astroturf) uses an older version of Next.js.

The solution is not that popular, but it was the first to use `.css` extraction with collocated styles.

### Otion

Looks promising, atomic css and light-weight. It has a working [Next.js example](https://github.com/kripod/otion/tree/main/packages/example-nextjs), but we didn't consider it because it lacks any documentation.

### Styletron

It looks like a not so popular solution, which also lacks support for TypeScript. It looks like the maintainers work at Uber and they use it internally. It focused on generating unique atomic CSS classes, which could potentially deduplicate a lot of code.

### Radium

The project was put in [Maintenance Mode](https://formidable.com/blog/2019/radium-maintenance/). They recommend other solutions.

### Glamorous

The project was [discontinued](https://github.com/paypal/glamorous/issues/419) in favor of Emotion.

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

<br />

## Feedback and Suggestions

To get in touch, my DMs are open [@pfeiffer_andrei](https://twitter.com/pfeiffer_andrei).

<br />

**Special thanks and appreciations** go to everyone that helped putting this document together, and making it more accurate:

- Martin Hochel ([@martin_hotell](https://twitter.com/martin_hotell))
- Oleg Isonen ([@oleg008](https://twitter.com/oleg008))

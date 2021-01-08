This is a [Next.js](https://nextjs.org/) project.

## Getting Started

First, run the development server:

```bash
yarn dev
```
<br />

## Overview

|       | Global styles | SSR | Dead code elimination | Code Split    | Auto-complete    | TS | External file | Vendor prefixes | Bundle overhead |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | ---: |
| Styled JSX | ✅ | ✅ | ❌ | ? | 🟠 | 🟠 | ✅ | ✅ | ? |
|  Styled Components |  |  |  |  |  |  |  |  |
|  Emotion |  |  |  |  |  |  |  |  |
|  Glamor |  |  |  |  |  |  |  |  |
|  Cxs |  |  |  |  |  |  |  |  |
|  Aphrodite |  |  |  |  |  |  |  |  |
|  Linaria |  |  |  |  |  |  |  |  |

<br />

### Styled JSX

- 🟠 need additional editor plugin for highlight & language service
- 🟠 has types on DT, but not sure if/how they help, as there isn't any library API to use (or very minimal)
- 🟠 no utilities
- 🟠 bundles styles even if they are not used in component
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

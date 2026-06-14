# Better React Media

**A modern, plugin-based React lightbox built for performance, accessibility, and customization.**

Published as an npm package — install it like any other React library.

## Quick Start

### Install

```sh
npm install better-react-media
# or
bun add better-react-media
# or
pnpm add better-react-media
```

Import the package styles:

```tsx
import { Lightbox } from 'better-react-media';
import 'better-react-media/styles.css';
```

### Use it

```tsx
import * as React from 'react';
import { Lightbox } from 'better-react-media';
import 'better-react-media/styles.css';

export default function App() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open Lightbox
      </button>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[
          { src: '/image1.jpg' },
          { src: '/image2.jpg' },
          { src: '/image3.jpg' },
        ]}
      />
    </>
  );
}
```

Add plugins only when you need them:

```tsx
import { Lightbox } from 'better-react-media';
import { Captions } from 'better-react-media/plugins/captions';
import { Zoom } from 'better-react-media/plugins/zoom';
import 'better-react-media/styles.css';

<Lightbox
  open={open}
  close={() => setOpen(false)}
  slides={slides}
  plugins={[Captions, Zoom]}
/>;
```

## Customization

### Inline styles per part

```tsx
<Lightbox
  styles={{
    container: { backgroundColor: 'rgba(0, 0, 0, 0.85)' },
    button: { color: '#fff' },
  }}
/>
```

### Extra class names per part

Useful when your app already uses Tailwind or another utility framework:

```tsx
<Lightbox classNames={{ button: 'hover:bg-red-500' }} />
```

### CSS variables on the root

```css
[data-lightbox] {
  --lightbox-color-backdrop: #111;
  --lightbox-color-button: #8a8f98;
  --lightbox-color-button-active: #fff;
}
```

Or via the `styles` prop:

```tsx
<Lightbox styles={{ root: { '--lightbox-color-backdrop': '#111' } }} />
```

### Render overrides

Use the `render` prop to replace any UI piece.

## Commands

| Command         | Description                           |
| --------------- | ------------------------------------- |
| `bun run dev`   | Start the playground dev server.      |
| `bun run build` | Build the npm package and playground. |
| `bun run test`  | Run the lightbox test suite.          |
| `bun run lint`  | Lint the codebase.                    |
| `bun run ci`    | Build, test, and lint — same as CI.   |

## Key Features

### Performance-first

Preloads a limited number of slides so images are ready before they appear, without slowing down the rest of your app.

### Plugin architecture

Core stays lean. Add captions, zoom, thumbnails, and more only when your project needs them.

### Responsive images

Supports `srcSet` and `sizes` so the browser picks the right resolution for each viewport.

### Accessible by default

Keyboard navigation and focus management are built into the core.

### Fully customizable

Override renderers, styles, class names, and CSS variables to match your design system.

### TypeScript

First-class types ship with the package — no separate `@types` package required.

## Plugins

| Import path                             | Description                 |
| --------------------------------------- | --------------------------- |
| `better-react-media/plugins/captions`   | Slide title and description |
| `better-react-media/plugins/counter`    | Current slide index         |
| `better-react-media/plugins/download`   | Download button             |
| `better-react-media/plugins/fullscreen` | Fullscreen mode             |
| `better-react-media/plugins/inline`     | Inline carousel layout      |
| `better-react-media/plugins/slideshow`  | Automatic slideshow         |
| `better-react-media/plugins/thumbnails` | Thumbnail track             |
| `better-react-media/plugins/zoom`       | Pinch, scroll, double-tap   |

## Responsive images

```tsx
<Lightbox
  open={open}
  close={() => setOpen(false)}
  slides={[
    {
      src: '/image1x3840.jpg',
      alt: 'image 1',
      width: 3840,
      height: 2560,
      srcSet: [
        { src: '/image1x320.jpg', width: 320, height: 213 },
        { src: '/image1x640.jpg', width: 640, height: 427 },
        { src: '/image1x1200.jpg', width: 1200, height: 800 },
        { src: '/image1x2048.jpg', width: 2048, height: 1365 },
        { src: '/image1x3840.jpg', width: 3840, height: 2560 },
      ],
    },
  ]}
/>
```

## Publishing

From the repo root:

```sh
cd packages/better-react-media
bun run build
npm publish
```

## Monorepo

This repository is a Turborepo monorepo:

- `packages/better-react-media` - publishable npm package (Vite build)
- `packages/ui` - shared UI primitives for the playground
- `apps/playground` - local dev playground (`bun run dev`)

## License

MIT

## Credits

This project is a ground-up rewrite inspired by [Yet Another React Lightbox](https://github.com/igordanchenko/yet-another-react-lightbox) by [Igor Danchenko](https://github.com/igordanchenko). Thank you for the original design and API that made this possible.

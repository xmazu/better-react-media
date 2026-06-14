import { Button } from '@workspace/ui/components/button';
import { Lightbox } from 'better-react-media';
import { Captions } from 'better-react-media/plugins/captions';
import { Counter } from 'better-react-media/plugins/counter';
import { Download } from 'better-react-media/plugins/download';
import { Fullscreen } from 'better-react-media/plugins/fullscreen';
import { Slideshow } from 'better-react-media/plugins/slideshow';
import { Thumbnails } from 'better-react-media/plugins/thumbnails';
import { Zoom } from 'better-react-media/plugins/zoom';
import * as React from 'react';

import slides from './slides';

const plugins = [
  { module: Captions, name: 'Captions' },
  { module: Counter, name: 'Counter' },
  { module: Download, name: 'Download' },
  { module: Fullscreen, name: 'Fullscreen' },
  { module: Slideshow, name: 'Slideshow' },
  { module: Thumbnails, name: 'Thumbnails' },
  { module: Zoom, name: 'Zoom' },
];

const previewSlides = slides.slice(0, 6);

export default function App() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="min-h-svh bg-onyx text-snow">
        <header className="sticky top-0 z-10 border-b border-graphite bg-charcoal/95 backdrop-blur-sm">
          <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-indigo" aria-hidden />
              <span className="text-sm font-medium tracking-tight">
                Better React Lightbox
              </span>
            </div>
            <span className="font-mono text-xs text-fog">npm package</span>
          </div>
        </header>

        <main className="mx-auto flex max-w-[1200px] flex-col gap-20 px-6 py-16">
          <section className="flex flex-col gap-6">
            <p className="flex items-center gap-2 text-[13px] text-mist">
              <span className="size-1 rounded-full bg-indigo" aria-hidden />
              Plugin-based image lightbox for React
              <span className="text-fog">→</span>
            </p>

            <div className="flex max-w-3xl flex-col gap-4">
              <h1 className="text-[48px] leading-[1.2] font-light tracking-[-0.624px] text-balance">
                Midnight command deck for your media gallery.
              </h1>
              <p className="max-w-2xl text-[17px] leading-[1.6] text-fog text-pretty">
                Keyboard, touch, and pointer navigation with responsive images
                and optional plugins. Install from npm and compose with plugins.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                aria-haspopup="dialog"
                onClick={() => setOpen(true)}
                className="h-9 rounded-md bg-acid-lime px-4 text-sm font-medium text-onyx shadow-button-depth hover:bg-acid-lime/90"
              >
                Open Lightbox
              </Button>
              <span className="font-mono text-xs text-slate">
                {slides.length} slides · {plugins.length} plugins
              </span>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-medium tracking-[-0.2px]">
                  Preview strip
                </h2>
                <p className="mt-1 text-sm text-fog">
                  Responsive srcSet gallery - tap any frame to open.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-graphite bg-charcoal p-3 shadow-card">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {previewSlides.map((slide, index) => (
                  <button
                    key={slide.src}
                    type="button"
                    className="group relative aspect-[4/3] overflow-hidden rounded-md border border-graphite bg-obsidian text-left transition-colors hover:border-iron"
                    onClick={() => setOpen(true)}
                    aria-label={slide.alt ?? `Open slide ${index + 1}`}
                  >
                    <img
                      src={slide.srcSet?.[2]?.src ?? slide.src}
                      alt={slide.alt ?? ''}
                      className="size-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                      loading="lazy"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-onyx/90 to-transparent px-3 py-2">
                      <span className="font-mono text-[11px] text-mist">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-medium tracking-[-0.2px]">
              Installed plugins
            </h2>
            <div className="flex flex-wrap gap-2">
              {plugins.map((plugin) => (
                <span
                  key={plugin.name}
                  className="inline-flex items-center gap-2 rounded-sm border border-graphite bg-obsidian px-2 py-1 text-xs font-medium text-mist"
                >
                  <span
                    className="size-1.5 rounded-full bg-emerald"
                    aria-hidden
                  />
                  {plugin.name}
                </span>
              ))}
            </div>
          </section>
        </main>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        plugins={plugins.map((plugin) => plugin.module)}
      />
    </>
  );
}

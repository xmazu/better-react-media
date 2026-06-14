import * as React from 'react';

import type { PluginProps } from '../../index';
import { addToolbarButton, createModule, PLUGIN_SLIDESHOW } from '../../index';
import { resolveSlideshowProps } from './props';
import { SlideshowButton } from './slideshow-button';
import { SlideshowContextProvider } from './slideshow-context';

/** Slideshow plugin */
export function Slideshow({ augment, addModule }: PluginProps) {
  augment(({ slideshow, toolbar, ...restProps }) => ({
    slideshow: resolveSlideshowProps(slideshow),
    toolbar: addToolbarButton(toolbar, PLUGIN_SLIDESHOW, <SlideshowButton />),
    ...restProps,
  }));

  addModule(createModule(PLUGIN_SLIDESHOW, SlideshowContextProvider));
}

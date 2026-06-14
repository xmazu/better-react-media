import * as React from 'react';

import type { PluginProps } from '../../index';
import {
  addToolbarButton,
  createModule,
  MODULE_CONTROLLER,
  PLUGIN_FULLSCREEN,
  PLUGIN_THUMBNAILS,
} from '../../index';
import { FullscreenButton } from './fullscreen-button';
import { FullscreenContextProvider } from './fullscreen-context';
import { resolveFullscreenProps } from './props';

/** Fullscreen plugin */
export function Fullscreen({ augment, contains, addParent }: PluginProps) {
  augment(({ fullscreen, toolbar, ...restProps }) => ({
    fullscreen: resolveFullscreenProps(fullscreen),
    toolbar: addToolbarButton(toolbar, PLUGIN_FULLSCREEN, <FullscreenButton />),
    ...restProps,
  }));

  addParent(
    contains(PLUGIN_THUMBNAILS) ? PLUGIN_THUMBNAILS : MODULE_CONTROLLER,
    createModule(PLUGIN_FULLSCREEN, FullscreenContextProvider)
  );
}

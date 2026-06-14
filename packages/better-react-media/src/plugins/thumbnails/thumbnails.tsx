import * as React from 'react';

import type { PluginProps } from '../../index';
import {
  addToolbarButton,
  createModule,
  MODULE_CONTROLLER,
  PLUGIN_FULLSCREEN,
  PLUGIN_THUMBNAILS,
} from '../../index';
import { resolveThumbnailsProps } from './props';
import { ThumbnailsButton } from './thumbnails-button';
import { ThumbnailsContextProvider } from './thumbnails-context';

/** Thumbnails plugin */
export function Thumbnails({
  augment,
  contains,
  append,
  addParent,
}: PluginProps) {
  augment(({ thumbnails: thumbnailsProps, toolbar, ...restProps }) => {
    const thumbnails = resolveThumbnailsProps(thumbnailsProps);
    return {
      thumbnails,
      toolbar: addToolbarButton(
        toolbar,
        PLUGIN_THUMBNAILS,
        thumbnails.showToggle ? <ThumbnailsButton /> : null
      ),
      ...restProps,
    };
  });

  const module = createModule(PLUGIN_THUMBNAILS, ThumbnailsContextProvider);
  if (contains(PLUGIN_FULLSCREEN)) {
    append(PLUGIN_FULLSCREEN, module);
  } else {
    addParent(MODULE_CONTROLLER, module);
  }
}

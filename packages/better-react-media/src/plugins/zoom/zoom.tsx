import * as React from 'react';

import type { Plugin } from '../../index';
import {
  addToolbarButton,
  createModule,
  isImageSlide,
  PLUGIN_ZOOM,
} from '../../index';
import { resolveZoomProps } from './props';
import { ZoomContextProvider } from './zoom-controller';
import { ZoomToolbarControl } from './zoom-toolbar-control';
import { ZoomWrapper } from './zoom-wrapper';

/** Zoom plugin */
export const Zoom: Plugin = ({ augment, addModule }) => {
  augment(({ zoom: zoomProps, toolbar, render, controller, ...restProps }) => {
    const zoom = resolveZoomProps(zoomProps);
    return {
      controller: { ...controller, preventDefaultWheelY: zoom.scrollToZoom },
      render: {
        ...render,
        slide: (props) =>
          isImageSlide(props.slide) ||
          (props.slide.type !== null &&
            zoom.supports?.includes(props.slide.type)) ? (
            <ZoomWrapper render={render} {...props} />
          ) : (
            render.slide?.(props)
          ),
      },
      toolbar: addToolbarButton(toolbar, PLUGIN_ZOOM, <ZoomToolbarControl />),
      zoom,
      ...restProps,
    };
  });

  addModule(createModule(PLUGIN_ZOOM, ZoomContextProvider));
};

import * as React from 'react';

import type { ComponentProps, ContainerRect, ZoomRef } from '../../index';
import { makeUseContext, useController } from '../../index';
import {
  useZoomCallback,
  useZoomImageRect,
  useZoomProps,
  useZoomSensors,
  useZoomState,
} from './hooks/index';

export interface ActiveZoomWrapper {
  zoomWrapperRef: React.RefObject<HTMLDivElement | null>;
  imageDimensions?: ContainerRect;
}

export type ZoomControllerContextType = ZoomRef & {
  setZoomWrapper: React.Dispatch<
    React.SetStateAction<ActiveZoomWrapper | undefined>
  >;
};

export const ZoomControllerContext =
  React.createContext<ZoomControllerContextType | null>(null);

export const useZoom = makeUseContext(
  'useZoom',
  'ZoomControllerContext',
  ZoomControllerContext
);

export function ZoomContextProvider({ children }: ComponentProps) {
  const [zoomWrapper, setZoomWrapper] = React.useState<ActiveZoomWrapper>();

  const { slideRect } = useController();
  const { ref, minZoom } = useZoomProps();
  const { imageRect, maxZoom } = useZoomImageRect(
    slideRect,
    zoomWrapper?.imageDimensions
  );

  const {
    zoom,
    offsetX,
    offsetY,
    disabled,
    changeZoom,
    changeOffsets,
    zoomIn,
    zoomOut,
  } = useZoomState(imageRect, maxZoom, zoomWrapper?.zoomWrapperRef);

  useZoomCallback(zoom, disabled);

  useZoomSensors(
    zoom,
    minZoom,
    maxZoom,
    disabled,
    zoomIn,
    zoomOut,
    changeZoom,
    changeOffsets,
    zoomWrapper?.zoomWrapperRef
  );

  const zoomRef = React.useMemo(
    () => ({
      changeZoom,
      disabled,
      maxZoom,
      minZoom,
      offsetX,
      offsetY,
      zoom,
      zoomIn,
      zoomOut,
    }),
    [
      zoom,
      minZoom,
      maxZoom,
      offsetX,
      offsetY,
      disabled,
      zoomIn,
      zoomOut,
      changeZoom,
    ]
  );

  React.useImperativeHandle(ref, () => zoomRef, [zoomRef]);

  const context = React.useMemo(
    () => ({ ...zoomRef, setZoomWrapper }),
    [zoomRef, setZoomWrapper]
  );

  return (
    <ZoomControllerContext.Provider value={context}>
      {children}
    </ZoomControllerContext.Provider>
  );
}

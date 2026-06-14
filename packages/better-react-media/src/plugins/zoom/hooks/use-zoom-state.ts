import * as React from 'react';

import type { ContainerRect } from '../../../index';
import {
  isImageSlide,
  round,
  useController,
  useEventCallback,
  useLayoutEffect,
  useLightboxState,
} from '../../../index';
import { useZoomAnimation } from './use-zoom-animation';
import { useZoomProps } from './use-zoom-props';

export function useZoomState(
  imageRect: ContainerRect,
  maxZoom: number,
  zoomWrapperRef?: React.RefObject<HTMLDivElement | null>
) {
  const [zoom, setZoom] = React.useState(1);
  const [offsetX, setOffsetX] = React.useState(0);
  const [offsetY, setOffsetY] = React.useState(0);

  const animate = useZoomAnimation(zoom, offsetX, offsetY, zoomWrapperRef);

  const { currentSlide, globalIndex } = useLightboxState();
  const { containerRect, slideRect } = useController();
  const { minZoom, zoomInMultiplier } = useZoomProps();

  // TODO v4: use `slide.key` to reset zoom on reactive slide replacement for custom slide types
  const currentSource =
    currentSlide && isImageSlide(currentSlide) ? currentSlide.src : undefined;
  const disabled = !zoomWrapperRef?.current;

  useLayoutEffect(() => {
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  }, [globalIndex, currentSource]);

  const changeOffsets = React.useCallback(
    (dx?: number, dy?: number, targetZoom?: number) => {
      const newZoom = targetZoom || zoom;

      const newOffsetX = offsetX - (dx || 0);
      const newOffsetY = offsetY - (dy || 0);

      const maxOffsetX =
        (imageRect.width * newZoom - slideRect.width) / 2 / newZoom;
      const maxOffsetY =
        (imageRect.height * newZoom - slideRect.height) / 2 / newZoom;

      setOffsetX(
        Math.min(Math.abs(newOffsetX), Math.max(maxOffsetX, 0)) *
          Math.sign(newOffsetX)
      );
      setOffsetY(
        Math.min(Math.abs(newOffsetY), Math.max(maxOffsetY, 0)) *
          Math.sign(newOffsetY)
      );
    },
    [zoom, offsetX, offsetY, slideRect, imageRect.width, imageRect.height]
  );

  const changeZoom = React.useCallback(
    (targetZoom: number, rapid?: boolean, dx?: number, dy?: number) => {
      const newZoom = round(
        targetZoom + 0.01 < maxZoom
          ? targetZoom - 0.01 > minZoom
            ? targetZoom
            : minZoom
          : maxZoom,
        5
      );

      if (!rapid) {
        animate();
      }

      changeOffsets(
        dx ? dx * (1 / zoom - 1 / newZoom) : 0,
        dy ? dy * (1 / zoom - 1 / newZoom) : 0,
        newZoom
      );

      setZoom(newZoom);
    },
    [zoom, minZoom, maxZoom, changeOffsets, animate]
  );

  const handleControllerRectChange = useEventCallback(() => {
    if (zoom > 1) {
      if (zoom > maxZoom) {
        changeZoom(maxZoom, true);
      }

      changeOffsets();
    }
  });

  useLayoutEffect(handleControllerRectChange, [
    containerRect.width,
    containerRect.height,
    handleControllerRectChange,
  ]);

  const zoomIn = React.useCallback(() => {
    const targetZoom = zoom * zoomInMultiplier;
    changeZoom(zoom < 1 && targetZoom > 1 ? 1 : targetZoom);
  }, [zoom, zoomInMultiplier, changeZoom]);

  const zoomOut = React.useCallback(() => {
    const targetZoom = zoom / zoomInMultiplier;
    changeZoom(zoom > 1 && targetZoom < 1 ? 1 : targetZoom);
  }, [zoom, zoomInMultiplier, changeZoom]);

  return {
    changeOffsets,
    changeZoom,
    disabled,
    offsetX,
    offsetY,
    zoom,
    zoomIn,
    zoomOut,
  };
}

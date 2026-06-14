import * as React from 'react';

import { cn } from '../../cn';
import type {
  ContainerRect,
  LightboxProps,
  RenderSlideProps,
} from '../../index';
import {
  ImageSlide,
  isImageSlide,
  mergeCompositorImageProps,
  useLayoutEffect,
  useLightboxProps,
  useLightboxState,
} from '../../index';
import { isResponsiveImageSlide, ResponsiveImage } from './responsive-image';
import { useZoom } from './zoom-controller';

import zoomWrapperStyles from './zoom-wrapper.module.css';

// using the non-augmented `render` here
export type ZoomWrapperProps = Pick<LightboxProps, 'render'> & RenderSlideProps;

/** Zoom wrapper */
export function ZoomWrapper({ render, slide, offset, rect }: ZoomWrapperProps) {
  const [imageDimensions, setImageDimensions] = React.useState<ContainerRect>();
  const zoomWrapperRef = React.useRef<HTMLDivElement>(null);

  const isImage = isImageSlide(slide);

  const { zoom, maxZoom, offsetX, offsetY, setZoomWrapper } = useZoom();
  const interactive = zoom > 1;

  const { carousel, on } = useLightboxProps();
  const { currentIndex } = useLightboxState();

  useLayoutEffect(() => {
    if (offset !== 0 || isImage || !zoomWrapperRef.current) {
      return () => {
        /* empty */
      };
    }

    const measure = () => {
      const wrapper = zoomWrapperRef.current;
      if (!wrapper) {
        return;
      }

      let width = 0;
      let height = 0;

      for (const child of wrapper.children) {
        if (child instanceof HTMLElement) {
          width = Math.max(width, child.offsetWidth);
          height = Math.max(height, child.offsetHeight);
        }
      }

      setImageDimensions((prev) =>
        prev && prev.width === width && prev.height === height
          ? prev
          : { height, width }
      );
    };

    measure();

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        /* empty */
      };
    }

    // observe children present at effect time; dynamically added children won't be tracked
    const observer = new ResizeObserver(measure);
    for (const child of zoomWrapperRef.current.children) {
      observer.observe(child);
    }

    return () => observer.disconnect();
  }, [offset, isImage, rect]);

  useLayoutEffect(() => {
    if (offset === 0) {
      setZoomWrapper({ imageDimensions, zoomWrapperRef });
      return () => setZoomWrapper(undefined);
    }
    return () => {
      /* empty */
    };
  }, [offset, imageDimensions, setZoomWrapper]);

  // Image slides with custom render functions still require explicit width/height on the slide because the default
  // ImageSlide's onLoad (which provides naturalWidth/naturalHeight) doesn't fire, and ResizeObserver only gives rendered
  // dimensions - insufficient for computing resolution-based max zoom. Consider adding setZoomDimensions callback to
  // render.slide props so custom render functions can report natural dimensions for both image and custom slide types.
  let rendered = render.slide?.({ maxZoom, offset, rect, slide, zoom });

  if (!rendered && isImage) {
    const slideProps = {
      imageFit: carousel.imageFit,
      imageProps: mergeCompositorImageProps(carousel.imageProps, !interactive),
      offset,
      onClick:
        offset === 0 ? () => on.click?.({ index: currentIndex }) : undefined,
      rect,
      render,
      slide,
    };

    rendered = isResponsiveImageSlide(slide) ? (
      <ResponsiveImage
        {...slideProps}
        slide={slide}
        interactive={interactive}
        rect={
          offset === 0
            ? { height: rect.height * zoom, width: rect.width * zoom }
            : rect
        }
      />
    ) : (
      <ImageSlide
        onLoad={(img) =>
          setImageDimensions({
            height: img.naturalHeight,
            width: img.naturalWidth,
          })
        }
        {...slideProps}
      />
    );
  }

  if (!rendered) {
    return null;
  }

  return (
    <div
      ref={zoomWrapperRef}
      className={cn(
        zoomWrapperStyles.wrapper,
        interactive && zoomWrapperStyles.interactive
      )}
      style={
        offset === 0
          ? {
              transform: `scale(${zoom}) translateX(${offsetX}px) translateY(${offsetY}px)`,
            }
          : undefined
      }
    >
      {rendered}
    </div>
  );
}

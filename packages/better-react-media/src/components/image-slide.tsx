import { CircleAlert, Loader2 } from 'lucide-react';
import * as React from 'react';

import { cn } from '../cn';
import type { SlideStatus } from '../consts';
import {
  activeSlideStatus,
  SLIDE_STATUS_COMPLETE,
  SLIDE_STATUS_ERROR,
  SLIDE_STATUS_LOADING,
} from '../consts';
import { useEvents, useTimeouts } from '../contexts/index';
import { useEventCallback } from '../hooks/index';
import type {
  CarouselSettings,
  ContainerRect,
  Render,
  SlideImage,
} from '../types';
import { hasWindow, isImageFitCover } from '../utils';

import imageSlideStyles from './image-slide.module.css';

const nonInfinite = (value: number, fallback: number) =>
  Number.isFinite(value) ? value : fallback;

export type ImageSlideProps = Partial<
  Pick<CarouselSettings, 'imageFit' | 'imageProps'>
> & {
  slide: SlideImage;
  offset?: number;
  render?: Render;
  rect?: ContainerRect;
  onClick?: () => void;
  onLoad?: (image: HTMLImageElement) => void;
  onError?: () => void;
  style?: React.CSSProperties;
};

export function ImageSlide({
  slide: image,
  offset,
  render,
  rect,
  imageFit,
  imageProps,
  onClick,
  onLoad,
  onError,
  style,
}: ImageSlideProps) {
  const [status, setStatus] = React.useState<SlideStatus>(SLIDE_STATUS_LOADING);

  const { publish } = useEvents();
  const { setTimeout } = useTimeouts();

  const imageRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (offset === 0) {
      publish(activeSlideStatus(status));
    }
  }, [offset, status, publish]);

  const handleLoading = useEventCallback((img: HTMLImageElement) => {
    ('decode' in img ? img.decode() : Promise.resolve())
      .catch(() => {
        /* empty */
      })
      .then(() => {
        if (!img.parentNode) {
          return;
        }
        setStatus(SLIDE_STATUS_COMPLETE);

        // this is a workaround for Zoom plugin's preload image swap
        // otherwise the 'complete' status does not get published
        setTimeout(() => {
          onLoad?.(img);
        }, 0);
      });
  });

  const setImageRef = React.useCallback(
    (img: HTMLImageElement | null) => {
      imageRef.current = img;

      if (img?.complete) {
        handleLoading(img);
      }
    },
    [handleLoading]
  );

  const handleOnLoad = React.useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      handleLoading(event.currentTarget);
    },
    [handleLoading]
  );

  const handleOnError = useEventCallback(() => {
    setStatus(SLIDE_STATUS_ERROR);

    onError?.();
  });

  const cover = isImageFitCover(image, imageFit);

  const maxWidth = nonInfinite(
    Math.max(
      ...[
        ...(image.srcSet?.map((x) => x.width) ?? []),
        ...(image.width ? [image.width] : []),
      ].filter(Boolean)
    ),
    imageRef.current?.naturalWidth || 0
  );

  const maxHeight = nonInfinite(
    Math.max(
      ...[
        ...(image.srcSet?.map((x) => x.height) ?? []),
        ...(image.height ? [image.height] : []),
      ].filter(Boolean)
    ),
    imageRef.current?.naturalHeight || 0
  );

  const defaultStyle =
    maxWidth && maxHeight
      ? {
          maxHeight: `min(${maxHeight}px, 100%)`,
          maxWidth: `min(${maxWidth}px, 100%)`,
        }
      : {
          maxHeight: '100%',
          maxWidth: '100%',
        };

  const srcSet = [...(image.srcSet ?? [])]
    .toSorted((a, b) => a.width - b.width)
    .map((item) => `${item.src} ${item.width}w`)
    .join(', ');

  const estimateActualWidth = () =>
    rect && !cover && image.width && image.height
      ? (rect.height / image.height) * image.width
      : Number.MAX_VALUE;

  const sizes =
    srcSet && rect && hasWindow()
      ? `${Math.round(Math.min(estimateActualWidth(), rect.width))}px`
      : undefined;

  const {
    style: imagePropsStyle,
    className: imagePropsClassName,
    ...restImageProps
  } = (typeof imageProps === 'function' ? imageProps(image) : imageProps) || {};

  const isComplete = status === SLIDE_STATUS_COMPLETE;

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
      <img
        ref={setImageRef}
        onLoad={handleOnLoad}
        onError={handleOnError}
        onClick={onClick}
        draggable={false}
        className={cn(
          imageSlideStyles.image,
          cover && imageSlideStyles.cover,
          !isComplete && imageSlideStyles.loading,
          imagePropsClassName
        )}
        style={{ ...defaultStyle, ...style, ...imagePropsStyle }}
        {...restImageProps}
        alt={image.alt ?? ''}
        sizes={sizes}
        srcSet={srcSet}
        src={image.src}
      />

      {!isComplete && (
        <div className={imageSlideStyles.status}>
          {status === SLIDE_STATUS_LOADING &&
            (render?.iconLoading ? (
              render.iconLoading()
            ) : (
              <Loader2
                className={cn(imageSlideStyles.icon, imageSlideStyles.animate)}
                data-animate=""
              />
            ))}
          {status === SLIDE_STATUS_ERROR &&
            (render?.iconError ? (
              render.iconError()
            ) : (
              <CircleAlert className={imageSlideStyles.iconError} />
            ))}
        </div>
      )}
    </>
  );
}

import * as React from 'react';

import { cn } from './cn';
import { IMAGE_FIT_CONTAIN, IMAGE_FIT_COVER } from './consts';
import type {
  CarouselSettings,
  ContainerRect,
  Label,
  Labels,
  LengthOrPercentage,
  LightboxProps,
  Slide,
  SlideImage,
  ToolbarSettings,
} from './types';

import imageSlideStyles from './components/image-slide.module.css';

export function composePrefix(base: string, prefix?: string) {
  return `${base}${prefix ? `_${prefix}` : ''}`;
}

export function makeComposePrefix(base: string) {
  return (prefix?: string) => composePrefix(base, prefix);
}

export function translateLabel(
  labels: Labels | undefined,
  defaultLabel: Label
) {
  return labels?.[defaultLabel] ?? defaultLabel;
}

/** @deprecated - use `translateLabel` instead */
export function label(labels: Labels | undefined, defaultLabel: Label) {
  return translateLabel(labels, defaultLabel);
}

export function translateSlideCounter(
  labels: Labels | undefined,
  slides: readonly Slide[],
  index: number
) {
  return translateLabel(labels, '{index} of {total}')
    .replaceAll('{index}', `${getSlideIndex(index, slides.length) + 1}`)
    .replaceAll('{total}', `${slides.length}`);
}

export function cleanup(...cleaners: (() => void)[]) {
  return () => {
    cleaners.forEach((cleaner) => {
      cleaner();
    });
  };
}

export function makeUseContext<T>(
  name: string,
  contextName: string,
  context: React.Context<T | null>
) {
  return () => {
    const ctx = React.useContext(context);
    if (!ctx) {
      throw new Error(`${name} must be used within a ${contextName}.Provider`);
    }
    return ctx;
  };
}

export function hasWindow() {
  return typeof window !== 'undefined';
}

export function round(value: number, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function isImageSlide(slide: Slide): slide is SlideImage {
  return slide.type === undefined || slide.type === 'image';
}

export function isImageFitCover(
  image: SlideImage,
  imageFit?: LightboxProps['carousel']['imageFit']
) {
  return (
    image.imageFit === IMAGE_FIT_COVER ||
    (image.imageFit !== IMAGE_FIT_CONTAIN && imageFit === IMAGE_FIT_COVER)
  );
}

export function parseInt(value: string | number) {
  return typeof value === 'string' ? Number.parseInt(value, 10) : value;
}

export function parseLengthPercentage(input: LengthOrPercentage) {
  if (typeof input === 'number') {
    return { pixel: input };
  }

  // noinspection SuspiciousTypeOfGuard
  if (typeof input === 'string') {
    const value = parseInt(input);
    return input.endsWith('%') ? { percent: value } : { pixel: value };
  }

  return { pixel: 0 };
}

export function computeSlideRect(
  containerRect: ContainerRect,
  padding: LengthOrPercentage
) {
  const paddingValue = parseLengthPercentage(padding);
  const paddingPixels =
    paddingValue.percent !== undefined
      ? (containerRect.width / 100) * paddingValue.percent
      : paddingValue.pixel;
  return {
    height: Math.max(containerRect.height - 2 * paddingPixels, 0),
    width: Math.max(containerRect.width - 2 * paddingPixels, 0),
  };
}

export function devicePixelRatio() {
  return (hasWindow() ? window?.devicePixelRatio : undefined) || 1;
}

export function getSlideIndex(index: number, slidesCount: number) {
  return slidesCount > 0
    ? ((index % slidesCount) + slidesCount) % slidesCount
    : 0;
}

export function hasSlides(
  slides: readonly Slide[]
): slides is [Slide, ...Slide[]] {
  return slides.length > 0;
}

export function getSlide(slides: [Slide, ...Slide[]], index: number) {
  return slides[getSlideIndex(index, slides.length)];
}

export function getSlideIfPresent(slides: readonly Slide[], index: number) {
  return hasSlides(slides) ? getSlide(slides, index) : undefined;
}

export function getSlideKey(slide: Slide) {
  // TODO v4: add `key` attribute to GenericSlide
  return isImageSlide(slide) ? slide.src : undefined;
}

export function addToolbarButton(
  toolbar: ToolbarSettings,
  key: string,
  button: React.ReactNode
) {
  if (!button) {
    return toolbar;
  }

  const { buttons, ...restToolbar } = toolbar;
  const index = buttons.indexOf(key);
  const buttonWithKey = React.isValidElement(button)
    ? React.cloneElement(button, { key }, null)
    : button;

  if (index !== -1) {
    const result = [...buttons];
    result.splice(index, 1, buttonWithKey);
    return { buttons: result, ...restToolbar };
  }

  return { buttons: [buttonWithKey, ...buttons], ...restToolbar };
}

// TODO v4: remove
export function stopNavigationEventsPropagation() {
  const stopPropagation = (
    event: React.PointerEvent | React.KeyboardEvent | React.WheelEvent
  ) => {
    event.stopPropagation();
  };

  return {
    onKeyDown: stopPropagation,
    onPointerDown: stopPropagation,
    onWheel: stopPropagation,
  };
}

export function calculatePreload(
  carousel: CarouselSettings,
  slides: readonly Slide[],
  minimum = 0
) {
  return Math.min(
    carousel.preload,
    Math.max(
      carousel.finite ? slides.length - 1 : Math.floor(slides.length / 2),
      minimum
    )
  );
}

const isReact19 = Number(React.version.split('.')[0]) >= 19;

// this hack is necessary to support `inert` attribute breaking change in React 19 - https://github.com/facebook/react/pull/24730
export function makeInertWhen(condition: boolean) {
  const legacyValue = condition ? '' : undefined;
  return { inert: isReact19 ? condition : legacyValue } as { inert: boolean };
}

export function reflow(node: HTMLElement) {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  node.scrollTop;
}

export function mergeCompositorImageProps(
  imageProps: CarouselSettings['imageProps'] | undefined,
  compositor: boolean
): CarouselSettings['imageProps'] | undefined {
  if (!compositor) {
    return imageProps;
  }

  if (typeof imageProps === 'function') {
    return (slide: Slide) => {
      const userProps = imageProps(slide) ?? {};
      return {
        ...userProps,
        className: cn(imageSlideStyles.compositor, userProps.className),
      };
    };
  }

  return {
    ...imageProps,
    className: cn(imageSlideStyles.compositor, imageProps?.className),
  };
}

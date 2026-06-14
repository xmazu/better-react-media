import * as React from 'react';

import { computeCarouselLayout } from '../carousel-layout';
import { cn } from '../cn';
import { ImageSlide } from '../components/index';
import { createModule } from '../config';
import { MODULE_CAROUSEL } from '../consts';
import {
  useA11yContext,
  useDocumentContext,
  useLightboxProps,
  useLightboxState,
} from '../contexts/index';
import type { ComponentProps, Slide } from '../types';
import {
  calculatePreload,
  getSlide,
  getSlideKey,
  hasSlides,
  isImageSlide,
  makeInertWhen,
  translateLabel,
  translateSlideCounter,
} from '../utils';
import { useController } from './controller/index';

import carouselStyles from './carousel.module.css';

interface CarouselSlideProps {
  slide: Slide;
  offset: number;
  slidePadding?: string;
}

function CarouselSlide({ slide, offset, slidePadding }: CarouselSlideProps) {
  const containerRef = React.useRef<HTMLElement>(null);

  const { currentIndex, slides } = useLightboxState();
  const { slideRect, focus } = useController();
  const {
    render,
    carousel: { imageFit, imageProps },
    on: { click: onClick },
    styles: { slide: style },
    classNames,
    labels,
  } = useLightboxProps();
  const { getOwnerDocument } = useDocumentContext();

  const offscreen = offset !== 0;

  React.useEffect(() => {
    if (
      offscreen &&
      containerRef.current?.contains(getOwnerDocument().activeElement)
    ) {
      focus();
    }
  }, [offscreen, focus, getOwnerDocument]);

  const renderSlide = () => {
    let rendered = render.slide?.({ offset, rect: slideRect, slide });

    if (!rendered && isImageSlide(slide)) {
      rendered = (
        <ImageSlide
          slide={slide}
          offset={offset}
          render={render}
          rect={slideRect}
          imageFit={imageFit}
          imageProps={imageProps}
          onClick={
            !offscreen ? () => onClick?.({ index: currentIndex }) : undefined
          }
        />
      );
    }

    return rendered ? (
      <>
        {render.slideHeader?.({ slide })}
        {(render.slideContainer ?? (({ children }) => children))({
          children: rendered,
          slide,
        })}
        {render.slideFooter?.({ slide })}
      </>
    ) : null;
  };

  return (
    <section
      ref={containerRef}
      className={cn(
        carouselStyles.slide,
        !offscreen && carouselStyles.current,
        classNames.slide
      )}
      {...makeInertWhen(offscreen)}
      style={{ padding: slidePadding, ...style }}
      aria-roledescription={translateLabel(labels, 'Slide')}
      aria-label={translateSlideCounter(labels, slides, currentIndex + offset)}
    >
      {renderSlide()}
    </section>
  );
}

function Placeholder({ slidePadding }: { slidePadding?: string }) {
  const { styles, classNames } = useLightboxProps();
  return (
    <div
      className={cn(carouselStyles.slidePlaceholder, classNames.slide)}
      style={{ padding: slidePadding, ...styles.slide }}
    />
  );
}

export function Carousel({ carousel, labels }: ComponentProps) {
  const { slides, currentIndex, globalIndex } = useLightboxState();
  const { setCarouselRef } = useController();
  const { autoPlaying, focusWithin } = useA11yContext();

  const preload = calculatePreload(carousel, slides, 1);
  const items: ({ key: React.Key } & (
    | { slide: Slide; offset: number }
    | { slide?: never; offset?: never }
  ))[] = [];

  if (hasSlides(slides)) {
    for (
      let index = currentIndex - preload;
      index <= currentIndex + preload;
      index += 1
    ) {
      const slide = getSlide(slides, index);
      const key = globalIndex - currentIndex + index;
      const placeholder =
        carousel.finite && (index < 0 || index > slides.length - 1);

      items.push(
        !placeholder
          ? {
              key: [`${key}`, getSlideKey(slide)].filter(Boolean).join('|'),
              offset: index - currentIndex,
              slide,
            }
          : { key }
      );
    }
  }

  const layout = computeCarouselLayout(
    items.length,
    carousel.spacing,
    carousel.padding
  );

  return (
    <section
      ref={setCarouselRef}
      className={cn(
        carouselStyles.carousel,
        items.length > 0 && carouselStyles.hasGap
      )}
      style={{
        columnGap: layout.columnGap,
        width: layout.width,
        ...({
          '--lightbox-carousel-gap': layout.columnGap,
        } as React.CSSProperties),
      }}
      aria-live={autoPlaying && !focusWithin ? 'off' : 'polite'}
      aria-roledescription={translateLabel(labels, 'Carousel')}
      aria-label={translateLabel(labels, 'Photo gallery')}
    >
      {items.map(({ key, slide, offset }) =>
        slide ? (
          <CarouselSlide
            key={key}
            slide={slide}
            offset={offset}
            slidePadding={layout.slidePadding}
          />
        ) : (
          <Placeholder key={key} slidePadding={layout.slidePadding} />
        )
      )}
    </section>
  );
}

export const CarouselModule = createModule(MODULE_CAROUSEL, Carousel);

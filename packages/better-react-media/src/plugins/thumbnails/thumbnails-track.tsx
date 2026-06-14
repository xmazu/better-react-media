import * as React from 'react';

import { cn } from '../../cn';
import type { Slide } from '../../index';
import {
  ACTION_NEXT,
  ACTION_PREV,
  calculatePreload,
  getSlide,
  getSlideKey,
  hasSlides,
  translateLabel,
  useContainerRect,
  useEvents,
  useKeyboardNavigation,
  useLightboxProps,
  useLightboxState,
  useSensors,
} from '../../index';
import { useThumbnailsProps } from './props';
import { Thumbnail } from './thumbnail';

import thumbnailsStyles from './thumbnails.module.css';

function isHorizontal(
  position: ReturnType<typeof useThumbnailsProps>['position']
) {
  return ['top', 'bottom'].includes(position);
}

function boxSize(
  thumbnails: ReturnType<typeof useThumbnailsProps>,
  dimension: number
) {
  return (
    dimension + 2 * (thumbnails.border + thumbnails.padding) + thumbnails.gap
  );
}

function resolveTrackWindow(centerIndex: number, preload: number) {
  return {
    firstIndex: centerIndex - preload,
    lastIndex: centerIndex + preload,
  };
}

function trackOffset(
  stripSize: number,
  thumbStride: number,
  activeIndex: number,
  firstIndex: number
) {
  if (stripSize <= 0) {
    return 0;
  }

  return (
    stripSize / 2 - thumbStride / 2 - (activeIndex - firstIndex) * thumbStride
  );
}

function getThumbnailKey(slide?: Slide | null) {
  const { thumbnail, poster } = (slide as {
    thumbnail?: unknown;
    poster?: unknown;
  }) || { thumbnail: 'placeholder' };

  return (
    (typeof thumbnail === 'string' && thumbnail) ||
    (typeof poster === 'string' && poster) ||
    (slide && getSlideKey(slide)) ||
    undefined
  );
}

export interface ThumbnailsTrackProps {
  visible: boolean;
}

export function ThumbnailsTrack({ visible }: ThumbnailsTrackProps) {
  const { containerRect, setContainerRef } = useContainerRect();

  const { publish } = useEvents();
  const { carousel, styles, classNames, labels } = useLightboxProps();
  const { slides, globalIndex } = useLightboxState();
  const { registerSensors, subscribeSensors } = useSensors();

  useKeyboardNavigation(subscribeSensors);

  const thumbnails = useThumbnailsProps();
  const {
    position,
    width,
    height,
    border,
    borderStyle,
    borderColor,
    borderRadius,
    padding,
    gap,
    vignette,
  } = thumbnails;

  const horizontal = isHorizontal(position);
  const thumbStride = boxSize(thumbnails, horizontal ? width : height);
  const stripSize = horizontal
    ? (containerRect?.width ?? 0)
    : (containerRect?.height ?? 0);
  const preload = calculatePreload(carousel, slides);
  const { firstIndex, lastIndex } = React.useMemo(
    () => resolveTrackWindow(globalIndex, preload),
    [globalIndex, preload]
  );
  const transformAxis = horizontal ? 'translateX' : 'translateY';
  const transform = React.useMemo(
    () => trackOffset(stripSize, thumbStride, globalIndex, firstIndex),
    [stripSize, thumbStride, globalIndex, firstIndex]
  );

  const items: { key: string; index: number; slide: Slide | null }[] = [];

  if (hasSlides(slides)) {
    for (let index = firstIndex; index <= lastIndex; index += 1) {
      const placeholder =
        carousel.finite && (index < 0 || index > slides.length - 1);
      const slide = placeholder ? null : getSlide(slides, index);
      const key = [`${index}`, getThumbnailKey(slide)]
        .filter(Boolean)
        .join('|');

      items.push({ index, key, slide });
    }
  }

  const handleClick = (slideIndex: number) => () => {
    if (slideIndex > globalIndex) {
      publish(ACTION_NEXT, { count: slideIndex - globalIndex });
    } else if (slideIndex < globalIndex) {
      publish(ACTION_PREV, { count: globalIndex - slideIndex });
    }
  };

  const trackDirection =
    position === 'start' || position === 'end'
      ? thumbnailsStyles.trackCol
      : thumbnailsStyles.trackRow;

  return (
    <div
      ref={setContainerRef}
      className={cn(
        thumbnailsStyles.container,
        !visible && thumbnailsStyles.hidden,
        classNames.thumbnailsContainer
      )}
      style={{
        ...styles.thumbnailsContainer,
      }}
    >
      <nav
        style={{
          gap: `${gap}px`,
          ...styles.thumbnailsTrack,
          transform: `${transformAxis}(${transform}px)`,
          transition: 'none',
        }}
        className={cn(
          thumbnailsStyles.track,
          trackDirection,
          classNames.thumbnailsTrack
        )}
        aria-label={translateLabel(labels, 'Thumbnails')}
        tabIndex={-1}
        {...registerSensors}
      >
        {items.map(({ key, index, slide }) => (
          <Thumbnail
            key={key}
            index={index}
            slide={slide}
            placeholder={!slide}
            onClick={handleClick(index)}
            width={width}
            height={height}
            border={border}
            borderStyle={borderStyle}
            borderColor={borderColor}
            borderRadius={borderRadius}
            padding={padding}
          />
        ))}
      </nav>
      {vignette && (
        <div
          aria-hidden
          className={cn(
            thumbnailsStyles.vignette,
            horizontal
              ? thumbnailsStyles.vignetteHorizontal
              : thumbnailsStyles.vignetteVertical
          )}
        />
      )}
    </div>
  );
}

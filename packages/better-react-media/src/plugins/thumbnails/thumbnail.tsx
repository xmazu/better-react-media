import { Image } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../cn';
import type { RenderThumbnailProps, Slide } from '../../index';
import {
  ImageSlide,
  isImageSlide,
  translateSlideCounter,
  useLightboxProps,
  useLightboxState,
} from '../../index';
import { useThumbnailsProps } from './props';

import thumbnailsStyles from './thumbnails.module.css';

function renderThumbnail({
  slide,
  render,
  rect,
  imageFit,
}: RenderThumbnailProps) {
  const customThumbnail = render.thumbnail?.({ imageFit, rect, render, slide });
  if (customThumbnail) {
    return customThumbnail;
  }

  const imageSlideProps = { imageFit, rect, render };

  if (slide.thumbnail) {
    return <ImageSlide slide={{ src: slide.thumbnail }} {...imageSlideProps} />;
  }

  if (isImageSlide(slide)) {
    return <ImageSlide slide={slide} {...imageSlideProps} />;
  }

  return <Image className={thumbnailsStyles.thumbnailIcon} />;
}

export interface FadeSettings {
  duration: number;
  delay: number;
}

export interface ThumbnailProps {
  slide: Slide | null;
  index: number;
  active?: boolean;
  onClick: () => void;
  placeholder: boolean;
  width: number;
  height: number;
  border: number;
  borderStyle?: string;
  borderColor?: string;
  borderRadius: number;
  padding: number;
}

export function Thumbnail({
  slide,
  index,
  active: activeProp,
  onClick,
  placeholder,
  width,
  height,
  border,
  borderStyle,
  borderColor,
  borderRadius,
  padding,
}: ThumbnailProps) {
  const { render, styles, classNames, labels } = useLightboxProps();
  const { slides, globalIndex } = useLightboxState();
  const { imageFit } = useThumbnailsProps();
  const rect = { height, width };
  const active = activeProp ?? index === globalIndex;

  return (
    <button
      type="button"
      className={cn(
        thumbnailsStyles.thumbnail,
        active && thumbnailsStyles.active,
        placeholder && thumbnailsStyles.placeholder,
        classNames.thumbnail
      )}
      style={{
        borderColor: borderColor || undefined,
        borderRadius: `${borderRadius}px`,
        borderStyle: borderStyle || 'solid',
        borderWidth: `${border}px`,
        height: `${height}px`,
        padding: `${padding}px`,
        width: `${width}px`,
        ...styles.thumbnail,
      }}
      onClick={onClick}
      aria-current={active ? true : undefined}
      aria-label={translateSlideCounter(labels, slides, index)}
    >
      {slide && renderThumbnail({ imageFit, rect, render, slide })}
    </button>
  );
}

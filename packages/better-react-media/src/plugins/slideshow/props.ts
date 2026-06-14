import type { SlideshowSettings } from '../../types';

export type { SlideshowSettings };

export const defaultSlideshowProps = {
  autoplay: false,
  delay: 3000,
  ref: null,
};

export const resolveSlideshowProps = (slideshow?: SlideshowSettings) => ({
  ...defaultSlideshowProps,
  ...slideshow,
});

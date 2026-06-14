import { useLightboxProps } from '../../index';
import type { ThumbnailsSettings } from '../../types';

export type { ThumbnailsSettings };

export const defaultThumbnailsProps = {
  border: 1,
  borderRadius: 4,
  gap: 16,
  height: 80,
  hidden: false,
  imageFit: 'contain' as const,
  padding: 4,
  position: 'bottom' as const,
  ref: null,
  showToggle: false,
  vignette: true,
  width: 120,
};

export const resolveThumbnailsProps = (thumbnails?: ThumbnailsSettings) => ({
  ...defaultThumbnailsProps,
  ...thumbnails,
});

export function useThumbnailsProps() {
  const { thumbnails } = useLightboxProps();
  return resolveThumbnailsProps(thumbnails);
}

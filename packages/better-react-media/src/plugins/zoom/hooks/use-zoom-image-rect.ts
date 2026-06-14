import type { ContainerRect, Slide } from '../../../index';
import {
  isImageFitCover,
  isImageSlide,
  round,
  useLightboxProps,
  useLightboxState,
} from '../../../index';
import { defaultZoomProps } from '../props';
import { useZoomProps } from './use-zoom-props';

function resolveMaxZoom(
  maxZoom: number | ((slide: Slide) => number | undefined),
  slide: Slide
) {
  const resolved =
    typeof maxZoom === 'function'
      ? (maxZoom(slide) ?? defaultZoomProps.maxZoom)
      : maxZoom;
  return Math.max(resolved, 1);
}

export function useZoomImageRect(
  slideRect: ContainerRect,
  imageDimensions?: ContainerRect
) {
  let imageRect: ContainerRect = { height: 0, width: 0 };
  let maxImageRect: ContainerRect = { height: 0, width: 0 };

  const { currentSlide } = useLightboxState();
  const { imageFit } = useLightboxProps().carousel;
  const { maxZoomPixelRatio, maxZoom: maxZoomInProps } = useZoomProps();

  if (slideRect && currentSlide) {
    const slide = { ...currentSlide, ...imageDimensions };
    if (isImageSlide(slide)) {
      const cover = isImageFitCover(slide, imageFit);

      const width = Math.max(
        ...(slide.srcSet?.map((x) => x.width) || []),
        ...(slide.width ? [slide.width] : [])
      );

      const height = Math.max(
        ...(slide.srcSet?.map((x) => x.height) || []),
        ...(slide.height ? [slide.height] : [])
      );

      if (
        width > 0 &&
        height > 0 &&
        slideRect.width > 0 &&
        slideRect.height > 0
      ) {
        maxImageRect = cover
          ? {
              height: Math.round(
                Math.min(height, (slideRect.height / slideRect.width) * width)
              ),
              width: Math.round(
                Math.min(width, (slideRect.width / slideRect.height) * height)
              ),
            }
          : { height, width };

        maxImageRect = {
          height: maxImageRect.height * maxZoomPixelRatio,
          width: maxImageRect.width * maxZoomPixelRatio,
        };

        imageRect = cover
          ? {
              height: Math.min(slideRect.height, maxImageRect.height, height),
              width: Math.min(slideRect.width, maxImageRect.width, width),
            }
          : {
              height: Math.round(
                Math.min(
                  slideRect.height,
                  (slideRect.width / width) * height,
                  height
                )
              ),
              width: Math.round(
                Math.min(
                  slideRect.width,
                  (slideRect.height / height) * width,
                  width
                )
              ),
            };
      }
    } else if (slideRect.width > 0 && slideRect.height > 0) {
      if (
        imageDimensions &&
        imageDimensions.width > 0 &&
        imageDimensions.height > 0
      ) {
        imageRect = {
          height: Math.min(slideRect.height, imageDimensions.height),
          width: Math.min(slideRect.width, imageDimensions.width),
        };
      } else {
        imageRect = { height: slideRect.height, width: slideRect.width };
      }
    }
  }

  let maxZoom = 1;
  if (currentSlide && imageRect.width) {
    maxZoom = isImageSlide(currentSlide)
      ? Math.max(round(maxImageRect.width / imageRect.width, 5), 1)
      : resolveMaxZoom(maxZoomInProps, currentSlide);
  }

  return { imageRect, maxZoom };
}

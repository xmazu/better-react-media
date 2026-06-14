import type { LengthOrPercentage } from './types';
import { parseLengthPercentage } from './utils';

export function computeCarouselLayout(
  slidesCount: number,
  spacing: LengthOrPercentage,
  padding: LengthOrPercentage
) {
  const spacingValue = parseLengthPercentage(spacing);
  const paddingValue = parseLengthPercentage(padding);
  const spacingPx = spacingValue.pixel || 0;
  const spacingPercent = spacingValue.percent || 0;
  const paddingPx = paddingValue.pixel || 0;
  const paddingPercent = paddingValue.percent || 0;

  if (slidesCount <= 0) {
    return { columnGap: undefined, slidePadding: undefined, width: undefined };
  }

  const width = `calc(100% + ${slidesCount - 1} * (100% + ${spacingPx}px + ${spacingPercent}%))`;

  const columnGap = `calc(${spacingPx}px + 100 / (${100 * slidesCount + (slidesCount - 1) * spacingPercent}) * ${spacingPercent}%)`;

  const slidePadding = `calc(${paddingPx}px + 100 / (${100 * slidesCount + (slidesCount - 1) * spacingPercent}) * ${paddingPercent}%)`;

  return { columnGap, slidePadding, width };
}

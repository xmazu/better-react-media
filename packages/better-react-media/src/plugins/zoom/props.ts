import type { ZoomSettings } from '../../types';

export type { ZoomSettings };

export const defaultZoomProps = {
  doubleClickMaxStops: 2,
  keyboardMoveDistance: 50,
  maxZoom: 8,
  maxZoomPixelRatio: 1,
  minZoom: 1,
  scrollToZoom: false,
  wheelZoomDistanceFactor: 100,
  zoomInMultiplier: 2,
};

function validateMinZoom(minZoom: number) {
  return Math.min(Math.max(minZoom, Number.EPSILON), 1);
}

export function resolveZoomProps(zoom?: ZoomSettings) {
  const { minZoom, ...rest } = { ...defaultZoomProps, ...zoom };
  return { minZoom: validateMinZoom(minZoom), ...rest };
}

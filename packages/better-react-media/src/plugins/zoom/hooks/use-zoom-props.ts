import { useLightboxProps } from '../../../index';
import { resolveZoomProps } from '../props';

export function useZoomProps() {
  const { zoom } = useLightboxProps();
  return resolveZoomProps(zoom);
}

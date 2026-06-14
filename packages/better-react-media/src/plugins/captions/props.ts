import { useLightboxProps } from '../../index';
import type { CaptionsSettings } from '../../types';

export type { CaptionsSettings };

export const defaultCaptionsProps = {
  descriptionMaxLines: 3,
  descriptionTextAlign: 'start' as const,
  hidden: false,
  showToggle: false,
};

export const resolveCaptionsProps = (captions?: CaptionsSettings) => ({
  ...defaultCaptionsProps,
  ...captions,
});

export function useCaptionsProps() {
  const { captions } = useLightboxProps();
  return resolveCaptionsProps(captions);
}

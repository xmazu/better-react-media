import type { FullscreenSettings } from '../../types';

export type { FullscreenSettings };

export const defaultFullscreenProps = {
  auto: false,
  ref: null,
};

export const resolveFullscreenProps = (fullscreen?: FullscreenSettings) => ({
  ...defaultFullscreenProps,
  ...fullscreen,
});

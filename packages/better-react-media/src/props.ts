import { ACTION_CLOSE, IMAGE_FIT_CONTAIN } from './consts';
import type { LightboxProps } from './types';

export const LightboxDefaultProps: LightboxProps = {
  animation: {
    easing: {
      fade: 'ease',
      navigation: 'ease-in-out',
      swipe: 'ease-out',
    },
    fade: 250,
    swipe: 500,
  },
  carousel: {
    finite: false,
    imageFit: IMAGE_FIT_CONTAIN,
    imageProps: {},
    padding: '16px',
    preload: 2,
    spacing: '30%',
  },
  className: '',
  close: () => {
    /* empty */
  },
  controller: {
    aria: false,
    closeOnBackdropClick: false,
    closeOnEscape: true,
    closeOnPullDown: false,
    closeOnPullUp: false,
    disableSwipeNavigation: false,
    focus: true,
    preventDefaultWheelX: true,
    preventDefaultWheelY: false,
    ref: null,
    touchAction: 'none',
  },
  index: 0,
  labels: {},
  noScroll: {
    disabled: false,
  },
  on: {},
  open: false,
  plugins: [],
  portal: {},
  render: {},
  slides: [],
  styles: {},
  classNames: {},
  toolbar: { buttons: [ACTION_CLOSE] },
};

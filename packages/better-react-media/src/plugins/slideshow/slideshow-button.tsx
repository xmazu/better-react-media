import { Pause, Play } from 'lucide-react';
import * as React from 'react';

import {
  ToolbarControl,
  useController,
  useLightboxProps,
  useLoseFocus,
} from '../../index';
import { useSlideshow } from './slideshow-context';

export function SlideshowButton() {
  const { playing, disabled, play, pause } = useSlideshow();
  const { render } = useLightboxProps();
  const focusListeners = useLoseFocus(useController().focus, disabled);

  if (render.buttonSlideshow) {
    return <>{render.buttonSlideshow({ disabled, pause, play, playing })}</>;
  }

  return (
    <ToolbarControl
      label={playing ? 'Pause' : 'Play'}
      icon={playing ? <Pause /> : <Play />}
      renderIcon={
        playing ? render.iconSlideshowPause : render.iconSlideshowPlay
      }
      onClick={playing ? pause : play}
      disabled={disabled}
      {...focusListeners}
    />
  );
}

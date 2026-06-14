import { Maximize, Minimize } from 'lucide-react';
import * as React from 'react';

import { ToolbarControl, useLightboxProps } from '../../index';
import { useFullscreen } from './fullscreen-context';

export function FullscreenButton() {
  const { fullscreen, disabled, enter, exit } = useFullscreen();
  const { render } = useLightboxProps();

  if (disabled) {
    return null;
  }

  if (render.buttonFullscreen) {
    return (
      <>{render.buttonFullscreen?.({ disabled, enter, exit, fullscreen })}</>
    );
  }

  return (
    <ToolbarControl
      disabled={disabled}
      label={fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      icon={fullscreen ? <Minimize /> : <Maximize />}
      renderIcon={
        fullscreen ? render.iconExitFullscreen : render.iconEnterFullscreen
      }
      onClick={fullscreen ? exit : enter}
    />
  );
}

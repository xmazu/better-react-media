import { Captions, CaptionsOff } from 'lucide-react';
import * as React from 'react';

import { ToolbarControl, useLightboxProps } from '../../index';
import { useCaptions } from './captions-context';

export function CaptionsButton() {
  const { visible, show, hide } = useCaptions();
  const { render } = useLightboxProps();

  if (render.buttonCaptions) {
    return <>{render.buttonCaptions({ hide, show, visible })}</>;
  }

  return (
    <ToolbarControl
      label={visible ? 'Hide captions' : 'Show captions'}
      icon={visible ? <Captions /> : <CaptionsOff />}
      renderIcon={
        visible ? render.iconCaptionsVisible : render.iconCaptionsHidden
      }
      onClick={visible ? hide : show}
    />
  );
}

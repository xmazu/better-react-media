import { ZoomIn, ZoomOut } from 'lucide-react';
import * as React from 'react';

import { ToolbarControl, useLightboxProps } from '../../index';
import { useZoom } from './zoom-controller';

export interface ZoomButtonProps {
  zoomIn?: boolean;
  onLoseFocus: () => void;
}

export const ZoomButton = React.forwardRef<HTMLButtonElement, ZoomButtonProps>(
  ({ zoomIn, onLoseFocus }, ref) => {
    const wasEnabled = React.useRef(false);
    const wasFocused = React.useRef(false);

    const {
      zoom,
      minZoom,
      maxZoom,
      zoomIn: zoomInCallback,
      zoomOut: zoomOutCallback,
      disabled: zoomDisabled,
    } = useZoom();
    const { render } = useLightboxProps();

    const disabled =
      zoomDisabled || (zoomIn ? zoom >= maxZoom : zoom <= minZoom);

    React.useEffect(() => {
      if (disabled && wasEnabled.current && wasFocused.current) {
        onLoseFocus();
      }
      if (!disabled) {
        wasEnabled.current = true;
      }
    }, [disabled, onLoseFocus]);

    return (
      <ToolbarControl
        ref={ref}
        disabled={disabled}
        label={zoomIn ? 'Zoom in' : 'Zoom out'}
        icon={zoomIn ? <ZoomIn /> : <ZoomOut />}
        renderIcon={zoomIn ? render.iconZoomIn : render.iconZoomOut}
        onClick={zoomIn ? zoomInCallback : zoomOutCallback}
        onFocus={() => {
          wasFocused.current = true;
        }}
        onBlur={() => {
          wasFocused.current = false;
        }}
      />
    );
  }
);

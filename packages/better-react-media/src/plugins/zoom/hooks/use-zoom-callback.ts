import * as React from 'react';

import { useEventCallback, useLightboxProps } from '../../../index';

export function useZoomCallback(zoom: number, disabled: boolean) {
  const { on } = useLightboxProps();

  const onZoomCallback = useEventCallback(() => {
    if (!disabled) {
      on.zoom?.({ zoom });
    }
  });

  React.useEffect(onZoomCallback, [zoom, onZoomCallback]);
}

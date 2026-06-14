import * as React from 'react';

import { useDelay } from './use-delay';
import { useEventCallback } from './use-event-callback';

export function useThrottle(
  callback: (...args: unknown[]) => void,
  delay: number
) {
  const lastCallbackTime = React.useRef(0);
  const delayCallback = useDelay();

  const executeCallback = useEventCallback((...args: unknown[]) => {
    lastCallbackTime.current = Date.now();
    callback(args);
  });

  return React.useCallback(
    (...args: unknown[]) => {
      delayCallback(
        () => {
          executeCallback(args);
        },
        delay - (Date.now() - lastCallbackTime.current)
      );
    },
    [delay, executeCallback, delayCallback]
  );
}

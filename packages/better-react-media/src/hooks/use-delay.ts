import * as React from 'react';

import { useTimeouts } from '../contexts/timeouts';

export function useDelay() {
  const timeoutId = React.useRef<number>();
  const { setTimeout, clearTimeout } = useTimeouts();

  return React.useCallback(
    (callback: () => void, delay: number) => {
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(callback, Math.max(delay, 0));
    },
    [setTimeout, clearTimeout]
  );
}

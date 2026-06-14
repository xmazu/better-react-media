import * as React from 'react';

import type { ContainerRect } from '../types';

export function useContainerRect<T extends HTMLElement = HTMLElement>() {
  const containerRef = React.useRef<T>(null);
  const observerRef = React.useRef<ResizeObserver>();
  const [containerRect, setContainerRect] = React.useState<ContainerRect>();

  const setContainerRef = React.useCallback((node: T | null) => {
    containerRef.current = node;

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = undefined;
    }

    const updateContainerRect = () => {
      if (node) {
        const styles = window.getComputedStyle(node);

        const parse = (value: string) => Number.parseFloat(value) || 0;

        setContainerRect({
          height: Math.round(
            node.clientHeight -
              parse(styles.paddingTop) -
              parse(styles.paddingBottom)
          ),
          width: Math.round(
            node.clientWidth -
              parse(styles.paddingLeft) -
              parse(styles.paddingRight)
          ),
        });
      } else {
        setContainerRect(undefined);
      }
    };

    updateContainerRect();

    if (node && typeof ResizeObserver !== 'undefined') {
      observerRef.current = new ResizeObserver(updateContainerRect);
      observerRef.current.observe(node);
    }
  }, []);

  return { containerRect, containerRef, setContainerRef };
}

import * as React from 'react';

import {
  ACTION_CLOSE,
  ACTION_NEXT,
  ACTION_PREV,
  EVENT_ON_KEY_DOWN,
  VK_ARROW_LEFT,
  VK_ARROW_RIGHT,
  VK_ESCAPE,
} from '../../consts';
import { useEvents, useLightboxProps } from '../../contexts/index';
import type { UseSensors } from '../../hooks/index';
import { useEventCallback, useThrottle } from '../../hooks/index';
import { useNavigationState } from './use-navigation-state';

export function useKeyboardNavigation<T extends Element>(
  subscribeSensors: UseSensors<T>['subscribeSensors']
) {
  const { publish } = useEvents();
  const { animation, controller } = useLightboxProps();
  const { prevDisabled, nextDisabled } = useNavigationState();

  const throttle = (animation.navigation ?? animation.swipe) / 2;

  const prev = useThrottle(() => publish(ACTION_PREV), throttle);
  const next = useThrottle(() => publish(ACTION_NEXT), throttle);

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case VK_ESCAPE: {
        if (!controller.closeOnEscape) {
          return;
        }
        publish(ACTION_CLOSE);
        break;
      }
      case VK_ARROW_LEFT: {
        if (!prevDisabled) {
          return prev();
        }
        break;
      }
      case VK_ARROW_RIGHT: {
        if (!nextDisabled) {
          return next();
        }
        break;
      }
      default: {
        return;
      }
    }
    // Prevent parent modals (e.g. Radix UI, MUI) from also acting on this keystroke -
    // without this, pressing Escape inside the lightbox would close both the lightbox
    // and the surrounding dialog.
    event.stopPropagation();
  });

  React.useEffect(
    () => subscribeSensors(EVENT_ON_KEY_DOWN, handleKeyDown),
    [subscribeSensors, handleKeyDown]
  );
}

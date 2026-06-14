import * as React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../cn';
import { LightboxRoot } from '../components/index';
import { createModule } from '../config';
import { ACTION_CLOSE, DATA_LIGHTBOX, MODULE_PORTAL } from '../consts';
import { useEvents, useTimeouts } from '../contexts/index';
import { useEventCallback, useMotionPreference } from '../hooks/index';
import { LightboxDefaultProps } from '../props';
import type { ComponentProps } from '../types';
import { reflow, translateLabel } from '../utils';

import portalStyles from './portal.module.css';

function setAttribute(element: Element, attribute: string, value: string) {
  const previousValue = element.getAttribute(attribute);

  element.setAttribute(attribute, value);

  return () => {
    if (previousValue) {
      element.setAttribute(attribute, previousValue);
    } else {
      element.removeAttribute(attribute);
    }
  };
}

const DEFAULT_PORTAL_CONTAINER = {};

export function Portal({
  portal: {
    root,
    container: {
      className: containerClassName,
      style: containerStyle,
      ...containerRest
    } = DEFAULT_PORTAL_CONTAINER,
  },
  animation,
  styles,
  classNames,
  className,
  on,
  close,
  labels,
  children,
}: ComponentProps) {
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  const cleanup = React.useRef<(() => void)[]>([]);
  const restoreFocus = React.useRef<Element>(null);
  const dialogRef = React.useRef<HTMLDialogElement | null>(null);

  const { setTimeout } = useTimeouts();
  const { subscribe } = useEvents();

  const reduceMotion = useMotionPreference();
  const animationDuration = !reduceMotion ? animation.fade : 0;

  React.useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
      setVisible(false);
    };
  }, []);

  const handleCleanup = useEventCallback(() => {
    for (const clean of cleanup.current) {
      clean();
    }
    cleanup.current = [];
  });

  const closeDialog = useEventCallback(() => {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
  });

  const handleClose = useEventCallback(() => {
    setVisible(false);

    handleCleanup();

    on.exiting?.();

    setTimeout(() => {
      closeDialog();
      on.exited?.();

      close();
    }, animationDuration);
  });

  React.useEffect(
    () => subscribe(ACTION_CLOSE, handleClose),
    [subscribe, handleClose]
  );

  const handleEnter = useEventCallback((node: HTMLDialogElement) => {
    reflow(node);

    setVisible(true);

    on.entering?.();

    const elements = node.parentNode?.children ?? [];
    for (let i = 0; i < elements.length; i += 1) {
      const element = elements[i];
      if (
        !['TEMPLATE', 'SCRIPT', 'STYLE'].includes(element.tagName) &&
        element !== node
      ) {
        cleanup.current.push(setAttribute(element, 'inert', ''));
        cleanup.current.push(setAttribute(element, 'aria-hidden', 'true'));
      }
    }

    cleanup.current.push(() => {
      (restoreFocus.current as HTMLElement | null)?.focus?.();
    });

    setTimeout(() => {
      on.entered?.();
    }, animationDuration);
  });

  const handleRef = React.useCallback(
    (node: HTMLDialogElement | null) => {
      dialogRef.current = node;

      if (node) {
        if (!node.open) {
          node.showModal();
        }

        handleEnter(node);
      } else {
        closeDialog();
        handleCleanup();
      }
    },
    [handleEnter, handleCleanup, closeDialog]
  );

  const handleCancel = useEventCallback((event: React.SyntheticEvent) => {
    event.preventDefault();
    handleClose();
  });

  const fadeDuration =
    animation.fade !== LightboxDefaultProps.animation.fade
      ? `${animationDuration}ms`
      : undefined;
  const fadeEasing =
    animation.easing.fade !== LightboxDefaultProps.animation.easing.fade
      ? animation.easing.fade
      : undefined;

  return mounted
    ? createPortal(
        <LightboxRoot
          as="dialog"
          ref={handleRef}
          onCancel={handleCancel}
          className={cn(
            portalStyles.portal,
            visible && portalStyles.visible,
            portalStyles.noScrollPadding,
            className,
            classNames.root,
            containerClassName
          )}
          {...{ [DATA_LIGHTBOX]: '' }}
          aria-modal
          aria-label={translateLabel(labels, 'Lightbox')}
          style={{
            ...(fadeDuration
              ? {
                  transitionDuration: fadeDuration,
                  '--lightbox-fade-duration': fadeDuration,
                }
              : null),
            ...(fadeEasing
              ? {
                  transitionTimingFunction: fadeEasing,
                  '--lightbox-fade-easing': fadeEasing,
                }
              : null),
            ...styles.root,
            ...containerStyle,
          }}
          onFocus={(event) => {
            if (!restoreFocus.current) {
              restoreFocus.current = event.relatedTarget;
            }
          }}
          {...containerRest}
        >
          {children}
        </LightboxRoot>,
        (typeof root === 'function' ? root() : root) || document.body
      )
    : null;
}

export const PortalModule = createModule(MODULE_PORTAL, Portal);

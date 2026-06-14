import * as React from 'react';

import { createModule } from '../config';
import { MODULE_NO_SCROLL } from '../consts';
import { useDocumentContext } from '../contexts/index';
import { domClasses, hasDomClass } from '../dom-classes';
import type { ComponentProps } from '../types';
import { parseInt } from '../utils';

import noScrollStyles from './no-scroll.module.css';

function isHTMLElement(element: Element): element is HTMLElement {
  return 'style' in element;
}

function padScrollbar(element: HTMLElement, padding: number) {
  const styles = window.getComputedStyle(element);
  const computedValue = styles.paddingRight;
  const originalValue = element.style.getPropertyValue('padding-right');

  element.style.setProperty(
    'padding-right',
    `${(parseInt(computedValue) || 0) + padding}px`
  );

  return () => {
    if (originalValue) {
      element.style.setProperty('padding-right', originalValue);
    } else {
      element.style.removeProperty('padding-right');
    }
  };
}

function hasNoScrollPadding(element: Element) {
  return (
    element instanceof HTMLElement &&
    hasDomClass(element, domClasses.noScrollPadding)
  );
}

export function NoScroll({ noScroll: { disabled }, children }: ComponentProps) {
  const { getOwnerDocument, getOwnerWindow } = useDocumentContext();

  React.useEffect(() => {
    if (disabled) {
      return () => {
        /* empty */
      };
    }

    const cleanup: (() => void)[] = [];

    const ownerWindow = getOwnerWindow();
    const { body, documentElement } = getOwnerDocument();

    const scrollbar = Math.round(
      ownerWindow.innerWidth - documentElement.clientWidth
    );
    if (scrollbar > 0) {
      cleanup.push(padScrollbar(body, scrollbar));

      const elements = body.querySelectorAll('*');
      for (let i = 0; i < elements.length; i += 1) {
        const element = elements[i];
        if (
          isHTMLElement(element) &&
          ownerWindow.getComputedStyle(element).getPropertyValue('position') ===
            'fixed' &&
          !hasNoScrollPadding(element)
        ) {
          cleanup.push(padScrollbar(element, scrollbar));
        }
      }
    }

    body.classList.add(noScrollStyles.noScroll);

    return () => {
      body.classList.remove(noScrollStyles.noScroll);

      cleanup.forEach((clean) => clean());
    };
  }, [disabled, getOwnerDocument, getOwnerWindow]);

  return <>{children}</>;
}

export const NoScrollModule = createModule(MODULE_NO_SCROLL, NoScroll);

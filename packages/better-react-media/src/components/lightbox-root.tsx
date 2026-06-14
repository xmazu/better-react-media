import * as React from 'react';

import { cn } from '../cn';
import { DocumentContextProvider, useA11yContext } from '../contexts/index';
import { useForkRef } from '../hooks/index';

import rootStyles from './lightbox-root.module.css';

type LightboxRootProps = {
  as?: 'div' | 'dialog';
  open?: boolean;
  onCancel?: React.ReactEventHandler<HTMLDialogElement>;
} & React.HTMLAttributes<HTMLElement>;

export const LightboxRoot = React.forwardRef<
  HTMLDivElement | HTMLDialogElement,
  LightboxRootProps
>(
  (
    { as = 'div', className, children, onFocus, onBlur, onCancel, ...rest },
    ref
  ) => {
    const nodeRef = React.useRef<HTMLDivElement | HTMLDialogElement>(null);
    const { trackFocusWithin } = useA11yContext();
    const forkedRef = useForkRef(ref, nodeRef);
    const resolvedClassName = cn(rootStyles.root, className);
    const focusWithinProps = trackFocusWithin(onFocus, onBlur);

    return (
      <DocumentContextProvider
        nodeRef={nodeRef as React.RefObject<HTMLDivElement>}
      >
        {as === 'dialog' ? (
          <dialog
            ref={forkedRef as React.Ref<HTMLDialogElement>}
            className={resolvedClassName}
            onCancel={onCancel}
            {...focusWithinProps}
            {...rest}
          >
            {children}
          </dialog>
        ) : (
          <div
            ref={forkedRef as React.Ref<HTMLDivElement>}
            className={resolvedClassName}
            {...focusWithinProps}
            {...rest}
          >
            {children}
          </div>
        )}
      </DocumentContextProvider>
    );
  }
);

import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '../cn';
import { createModule } from '../config';
import { ACTION_CLOSE, MODULE_TOOLBAR } from '../consts';
import { useLayoutEffect } from '../hooks/index';
import { useContainerRect } from '../hooks/use-container-rect';
import type { ComponentProps } from '../types';
import { useController } from './controller/index';
import { ToolbarControl } from './toolbar-control';

import toolbarStyles from './toolbar.module.css';

export function Toolbar({
  toolbar: { buttons },
  render: { buttonClose, iconClose },
  styles,
  classNames,
}: ComponentProps) {
  const { close, setToolbarWidth } = useController();
  const { setContainerRef, containerRect } = useContainerRect();

  useLayoutEffect(() => {
    setToolbarWidth(containerRect?.width);
  }, [setToolbarWidth, containerRect?.width]);

  const renderCloseButton = () => {
    if (buttonClose) {
      return buttonClose();
    }

    return (
      <ToolbarControl
        key={ACTION_CLOSE}
        label="Close"
        icon={<X />}
        renderIcon={iconClose}
        onClick={close}
      />
    );
  };

  return (
    <div
      ref={setContainerRef}
      style={styles.toolbar}
      className={cn(toolbarStyles.toolbar, classNames.toolbar)}
    >
      {buttons?.map((button) =>
        button === ACTION_CLOSE ? renderCloseButton() : button
      )}
    </div>
  );
}

export const ToolbarModule = createModule(MODULE_TOOLBAR, Toolbar);

import * as React from 'react';

import { cn } from '../cn';
import { Button } from '../components/button';
import { useLightboxProps } from '../contexts/index';
import type { Label, RenderFunction } from '../types';
import { translateLabel } from '../utils';

import buttonStyles from '../components/button.module.css';

export type ToolbarControlProps = React.ComponentProps<typeof Button> & {
  label: Label;
  icon: React.ReactNode;
  renderIcon?: RenderFunction;
};

export const ToolbarControl = React.forwardRef<
  HTMLButtonElement,
  ToolbarControlProps
>(
  (
    {
      label,
      icon,
      renderIcon,
      className,
      style,
      variant = 'ghost',
      size = 'icon',
      ...rest
    },
    ref
  ) => {
    const { labels, styles, classNames } = useLightboxProps();
    const buttonLabel = translateLabel(labels, label);

    return (
      <Button
        ref={ref}
        type="button"
        variant={variant}
        size={size}
        aria-label={buttonLabel}
        title={buttonLabel}
        className={cn(buttonStyles.button, className, classNames.button)}
        style={{ ...style, ...styles.button }}
        {...rest}
      >
        {renderIcon ? renderIcon() : icon}
      </Button>
    );
  }
);

import * as React from 'react';

import { cn } from '../cn';

import buttonStyles from './button.module.css';

export type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'default' | 'ghost';
  size?: 'default' | 'icon';
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      type = 'button',
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        buttonStyles.button,
        variant === 'ghost' && buttonStyles.ghost,
        size === 'icon' && buttonStyles.icon,
        className
      )}
      {...props}
    />
  )
);

Button.displayName = 'Button';

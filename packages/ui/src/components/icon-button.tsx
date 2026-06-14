import * as React from 'react';

import { cn } from '#lib/utils';

import { Button } from './button';

function IconButton({
  className,
  variant = 'ghost',
  size = 'icon-xs',
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      {...props}
    />
  );
}

export { IconButton };

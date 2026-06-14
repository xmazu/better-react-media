import * as React from 'react';

import { cn } from '../../cn';
import { DATA_LIGHTBOX } from '../../consts';
import type { ComponentProps } from '../../index';
import { LightboxRoot } from '../../index';

import inlineStyles from './inline.module.css';

const DEFAULT_INLINE = {};

/** Inline plugin container */
export function InlineContainer({
  inline: { className, style, ...rest } = DEFAULT_INLINE,
  styles,
  classNames,
  children,
}: ComponentProps) {
  return (
    <LightboxRoot
      className={cn(inlineStyles.inline, className, classNames.root)}
      style={{ overscrollBehavior: 'contain auto', ...styles.root, ...style }}
      {...{ [DATA_LIGHTBOX]: '' }}
      {...rest}
    >
      {children}
    </LightboxRoot>
  );
}

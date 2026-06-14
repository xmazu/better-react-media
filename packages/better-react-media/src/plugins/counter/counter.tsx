import * as React from 'react';

import { cn } from '../../cn';
import type { ComponentProps, PluginProps } from '../../index';
import {
  createModule,
  MODULE_CONTROLLER,
  PLUGIN_COUNTER,
  useLightboxState,
} from '../../index';
import { resolveCounterProps } from './props';

import counterStyles from './counter.module.css';

export function CounterComponent({ counter }: ComponentProps) {
  const { slides, currentIndex } = useLightboxState();

  const {
    separator,
    container: { className, ...rest },
  } = resolveCounterProps(counter);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className={cn(counterStyles.counter, className)} {...rest} aria-hidden>
      {currentIndex + 1} {separator} {slides.length}
    </div>
  );
}

/** Counter plugin */
export function Counter({ augment, addChild }: PluginProps) {
  augment(({ counter, ...restProps }) => ({
    counter: resolveCounterProps(counter),
    ...restProps,
  }));

  addChild(MODULE_CONTROLLER, createModule(PLUGIN_COUNTER, CounterComponent));
}

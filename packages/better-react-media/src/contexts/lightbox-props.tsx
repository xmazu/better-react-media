import * as React from 'react';

import type { ComponentProps } from '../types';
import { makeUseContext } from '../utils';

export type LightboxPropsContextType = Omit<ComponentProps, 'children'>;

export const LightboxPropsContext =
  React.createContext<LightboxPropsContextType | null>(null);

export const useLightboxProps = makeUseContext(
  'useLightboxProps',
  'LightboxPropsContext',
  LightboxPropsContext
);

export function LightboxPropsProvider({ children, ...props }: ComponentProps) {
  return (
    <LightboxPropsContext.Provider value={props}>
      {children}
    </LightboxPropsContext.Provider>
  );
}

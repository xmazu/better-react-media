import * as React from 'react';

import type { CaptionsRef, ComponentProps } from '../../index';
import { makeUseContext } from '../../index';
import { resolveCaptionsProps } from './props';

export const CaptionsContext = React.createContext<CaptionsRef | null>(null);

export const useCaptions = makeUseContext(
  'useCaptions',
  'CaptionsContext',
  CaptionsContext
);

export function CaptionsContextProvider({
  captions,
  children,
}: ComponentProps) {
  const { ref, hidden } = resolveCaptionsProps(captions);

  const [visible, setVisible] = React.useState(!hidden);

  const context = React.useMemo(
    () => ({
      hide: () => setVisible(false),
      show: () => setVisible(true),
      visible,
    }),
    [visible]
  );

  React.useImperativeHandle(ref, () => context, [context]);

  return (
    <CaptionsContext.Provider value={context}>
      {children}
    </CaptionsContext.Provider>
  );
}

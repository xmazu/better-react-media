import * as React from 'react';

import { hasWindow } from '../utils';

export const useLayoutEffect = hasWindow()
  ? React.useLayoutEffect
  : React.useEffect;

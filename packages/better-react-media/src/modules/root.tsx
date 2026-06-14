import * as React from 'react';

import { createModule } from '../config';
import { MODULE_ROOT } from '../consts';
import type { ComponentProps } from '../types';

export function Root({ children }: ComponentProps) {
  return <>{children}</>;
}

export const RootModule = createModule(MODULE_ROOT, Root);

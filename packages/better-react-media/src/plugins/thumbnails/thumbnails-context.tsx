import * as React from 'react';

import { cn } from '../../cn';
import type { ComponentProps, ThumbnailsRef } from '../../index';
import { LightboxPropsProvider, makeUseContext } from '../../index';
import { resolveThumbnailsProps } from './props';
import { ThumbnailsTrack } from './thumbnails-track';

import thumbnailsStyles from './thumbnails.module.css';

export const ThumbnailsContext = React.createContext<ThumbnailsRef | null>(
  null
);

export const useThumbnails = makeUseContext(
  'useThumbnails',
  'ThumbnailsContext',
  ThumbnailsContext
);

/** Thumbnails plugin component */
export function ThumbnailsContextProvider({
  children,
  ...props
}: ComponentProps) {
  const { ref, position, hidden } = resolveThumbnailsProps(props.thumbnails);

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

  const isColumn = position === 'top' || position === 'bottom';

  return (
    <LightboxPropsProvider {...props}>
      <ThumbnailsContext.Provider value={context}>
        <div
          className={cn(
            thumbnailsStyles.layout,
            isColumn && thumbnailsStyles.flexCol
          )}
          data-position={position}
        >
          {['start', 'top'].includes(position) && (
            <ThumbnailsTrack visible={visible} />
          )}
          <div className={thumbnailsStyles.main}>{children}</div>
          {['end', 'bottom'].includes(position) && (
            <ThumbnailsTrack visible={visible} />
          )}
        </div>
      </ThumbnailsContext.Provider>
    </LightboxPropsProvider>
  );
}

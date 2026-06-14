import * as React from 'react';

import { cn } from '../../cn';
import type { Slide } from '../../index';
import { useController, useLightboxProps } from '../../index';
import { useCaptions } from './captions-context';

import captionsStyles from './captions.module.css';

export type TitleProps = Pick<Slide, 'title'>;

export function Title({ title }: TitleProps) {
  const { toolbarWidth } = useController();
  const { styles, classNames } = useLightboxProps();
  const { visible } = useCaptions();

  if (!visible) {
    return null;
  }

  return (
    <h2
      style={styles.captionsTitleContainer}
      className={cn(
        captionsStyles.titleContainer,
        classNames.captionsTitleContainer
      )}
    >
      <div
        className={cn(captionsStyles.title, classNames.captionsTitle)}
        style={{
          ...(toolbarWidth
            ? { maxWidth: `calc(100% - ${toolbarWidth}px)` }
            : null),
          ...styles.captionsTitle,
        }}
      >
        {title}
      </div>
    </h2>
  );
}

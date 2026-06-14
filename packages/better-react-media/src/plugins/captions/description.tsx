import * as React from 'react';

import { cn } from '../../cn';
import type { Slide } from '../../index';
import { translateLabel, useLightboxProps } from '../../index';
import { useCaptions } from './captions-context';
import { defaultCaptionsProps, useCaptionsProps } from './props';

import captionsStyles from './captions.module.css';

export type DescriptionProps = Pick<Slide, 'description'>;

export function Description({ description }: DescriptionProps) {
  const { descriptionTextAlign, descriptionMaxLines } = useCaptionsProps();
  const { styles, classNames, labels } = useLightboxProps();
  const { visible } = useCaptions();

  if (!visible) {
    return null;
  }

  // noinspection SuspiciousTypeOfGuard
  return (
    <div
      style={styles.captionsDescriptionContainer}
      className={cn(
        captionsStyles.descriptionContainer,
        classNames.captionsDescriptionContainer
      )}
    >
      <p
        className={cn(
          captionsStyles.description,
          classNames.captionsDescription
        )}
        style={{
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp:
            descriptionMaxLines !== defaultCaptionsProps.descriptionMaxLines
              ? descriptionMaxLines
              : 3,
          display: '-webkit-box',
          textAlign:
            descriptionTextAlign !== defaultCaptionsProps.descriptionTextAlign
              ? descriptionTextAlign
              : undefined,
          ...styles.captionsDescription,
        }}
        aria-roledescription={translateLabel(labels, 'Caption')}
      >
        {typeof description === 'string'
          ? description
              .split('\n')
              .flatMap((line, index) => [
                ...(index > 0 ? [<br key={index} />] : []),
                line,
              ])
          : description}
      </p>
    </div>
  );
}

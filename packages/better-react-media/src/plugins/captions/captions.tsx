import * as React from 'react';

import type { PluginProps } from '../../index';
import { addToolbarButton, createModule, PLUGIN_CAPTIONS } from '../../index';
import { CaptionsButton } from './captions-button';
import { CaptionsContextProvider } from './captions-context';
import { Description } from './description';
import { resolveCaptionsProps } from './props';
import { Title } from './title';

/** Captions plugin */
export function Captions({ augment, addModule }: PluginProps) {
  augment(
    ({
      captions: captionsProps,
      render: { slideFooter: renderFooter, ...restRender },
      toolbar,
      ...restProps
    }) => {
      const captions = resolveCaptionsProps(captionsProps);
      return {
        captions,
        render: {
          slideFooter: ({ slide }) => (
            <>
              {renderFooter?.({ slide })}

              {slide.title && <Title title={slide.title} />}

              {slide.description && (
                <Description description={slide.description} />
              )}
            </>
          ),
          ...restRender,
        },
        toolbar: addToolbarButton(
          toolbar,
          PLUGIN_CAPTIONS,
          captions.showToggle ? <CaptionsButton /> : null
        ),
        ...restProps,
      };
    }
  );

  addModule(createModule(PLUGIN_CAPTIONS, CaptionsContextProvider));
}

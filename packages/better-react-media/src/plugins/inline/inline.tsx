import type { PluginProps } from '../../index';
import {
  ACTION_CLOSE,
  createModule,
  MODULE_NO_SCROLL,
  MODULE_PORTAL,
  PLUGIN_INLINE,
} from '../../index';
import { InlineContainer } from './inline-container';

/** Inline plugin */
export function Inline({ augment, replace, remove }: PluginProps) {
  augment(
    ({
      toolbar: { buttons, ...restToolbar },
      open: _open,
      close: _close,
      controller: {
        focus: _focus,
        aria: _aria,
        touchAction: _touchAction,
        ...restController
      },
      className,
      ...restProps
    }) => ({
      open: true,
      /* c8 ignore next */
      close: () => {
        /* empty */
      },
      toolbar: {
        buttons: buttons.filter((button) => button !== ACTION_CLOSE),
        ...restToolbar,
      },
      inline: { className, style: { height: '100%', width: '100%' } },
      // TODO v4: implement `touch-action` similar to `overscroll-behavior`
      controller: {
        aria: true,
        focus: false,
        touchAction: 'pan-y',
        ...restController,
      },
      className,
      ...restProps,
    })
  );

  remove(MODULE_NO_SCROLL);
  replace(MODULE_PORTAL, createModule(PLUGIN_INLINE, InlineContainer));
}

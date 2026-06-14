import * as React from 'react';

import type { PluginProps } from '../../index';
import { addToolbarButton, PLUGIN_DOWNLOAD } from '../../index';
import { DownloadButton } from './download-button';
import { resolveDownloadProps } from './props';

export function Download({ augment }: PluginProps) {
  augment(({ toolbar, download, ...restProps }) => ({
    download: resolveDownloadProps(download),
    toolbar: addToolbarButton(toolbar, PLUGIN_DOWNLOAD, <DownloadButton />),
    ...restProps,
  }));
}

import { Download } from 'lucide-react';
import * as React from 'react';

import {
  isImageSlide,
  ToolbarControl,
  useLightboxProps,
  useLightboxState,
} from '../../index';
import { saveAs } from './file-saver';
import { resolveDownloadProps } from './props';

function resolveDownloadUrl(
  slide: NonNullable<ReturnType<typeof useLightboxState>['currentSlide']>
) {
  if (typeof slide.download === 'string') {
    return slide.download;
  }

  if (typeof slide.download === 'object') {
    return slide.download.url;
  }

  if (isImageSlide(slide)) {
    return slide.src;
  }
}

function resolveDownloadFilename(
  slide: NonNullable<ReturnType<typeof useLightboxState>['currentSlide']>
) {
  if (typeof slide.download === 'object') {
    return slide.download.filename;
  }
}

export function DownloadButton() {
  const { render, on, download: downloadProps } = useLightboxProps();
  const { download: customDownload } = resolveDownloadProps(downloadProps);
  const { currentSlide, currentIndex } = useLightboxState();

  if (render.buttonDownload) {
    return <>{render.buttonDownload()}</>;
  }

  const downloadUrl = currentSlide
    ? resolveDownloadUrl(currentSlide)
    : undefined;

  const canDownload = customDownload
    ? currentSlide?.download !== false
    : Boolean(downloadUrl);

  const defaultDownload = () => {
    if (currentSlide && downloadUrl) {
      saveAs(downloadUrl, resolveDownloadFilename(currentSlide));
    }
  };

  const handleDownload = () => {
    if (currentSlide) {
      (customDownload || defaultDownload)({ saveAs, slide: currentSlide });

      on.download?.({ index: currentIndex });
    }
  };

  return (
    <ToolbarControl
      label="Download"
      icon={<Download />}
      renderIcon={render.iconDownload}
      disabled={!canDownload}
      onClick={handleDownload}
    />
  );
}

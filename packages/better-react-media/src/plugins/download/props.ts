import type { DownloadSettings } from '../../types';

export type { DownloadSettings };

export const defaultDownloadProps = {
  download: undefined,
};

export const resolveDownloadProps = (download?: DownloadSettings) => ({
  ...defaultDownloadProps,
  ...download,
});

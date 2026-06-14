import { LayoutGrid } from 'lucide-react';
import * as React from 'react';

import { ToolbarControl, useLightboxProps } from '../../index';
import { useThumbnails } from './thumbnails-context';

import thumbnailsStyles from './thumbnails.module.css';

function ThumbnailsHiddenIcon() {
  return (
    <span className={thumbnailsStyles.thumbnailsButtonIcon}>
      <LayoutGrid />
      <span className={thumbnailsStyles.thumbnailsButtonStrike}>
        <span className={thumbnailsStyles.thumbnailsButtonLine} />
      </span>
    </span>
  );
}

export function ThumbnailsButton() {
  const { visible, show, hide } = useThumbnails();
  const { render } = useLightboxProps();

  if (render.buttonThumbnails) {
    return <>{render.buttonThumbnails({ hide, show, visible })}</>;
  }

  return (
    <ToolbarControl
      label={visible ? 'Hide thumbnails' : 'Show thumbnails'}
      icon={visible ? <LayoutGrid /> : <ThumbnailsHiddenIcon />}
      renderIcon={
        visible ? render.iconThumbnailsVisible : render.iconThumbnailsHidden
      }
      onClick={visible ? hide : show}
    />
  );
}

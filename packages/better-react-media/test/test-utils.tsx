import { act, screen } from '@testing-library/react';
import * as React from 'react';

import { DATA_LIGHTBOX } from '../src/consts';
import { domClasses } from '../src/dom-classes';
import Lightbox from '../src/index';

function lightboxRoot() {
  return document.querySelector(`[${DATA_LIGHTBOX}]`);
}

export function lightbox(props?: Parameters<typeof Lightbox>[0]) {
  return <Lightbox open {...props} />;
}

export function querySelector(selector: string) {
  return lightboxRoot()?.querySelector(selector) ?? null;
}

export function findCurrentSlide() {
  return document.querySelector(
    `.${CSS.escape(domClasses.slide)}.${CSS.escape(domClasses.slideCurrent)}`
  );
}

export function findCurrentImage() {
  return findCurrentSlide()?.querySelector('img')?.src;
}

export function expectCurrentImageToBe(source: string) {
  expect(findCurrentImage()).toContain(source);
}

export function clickButton(name: string) {
  act(() => {
    screen.getByRole('button', { name }).click();
  });
}

export function queryButton(name: string) {
  return screen.queryByRole('button', { name });
}

export function expectToContainButton(name: string) {
  expect(queryButton(name)).toBeInTheDocument();
}

export function expectNotToContainButton(name: string) {
  expect(queryButton(name)).not.toBeInTheDocument();
}

export function expectLightboxToBeOpen() {
  expect(lightboxRoot()).toBeInTheDocument();
}

export function expectLightboxToBeClosed() {
  expect(lightboxRoot()).not.toBeInTheDocument();
}

export function queryThumbnails(withImage = true) {
  return screen
    .queryAllByRole('button')
    .filter((el) => el.classList.contains(domClasses.thumbnail))
    .filter((el) => !withImage || Boolean(el.querySelector('img')))
    .filter((el) => {
      const container = el.closest(
        `.${CSS.escape(domClasses.thumbnailsContainer)}`
      );
      return (
        container && !container.classList.contains(domClasses.thumbnailsHidden)
      );
    });
}

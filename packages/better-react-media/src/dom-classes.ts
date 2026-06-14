import buttonStyles from './components/button.module.css';
import carouselStyles from './modules/carousel.module.css';
import controllerStyles from './modules/controller/controller.module.css';
import portalStyles from './modules/portal.module.css';
import toolbarStyles from './modules/toolbar.module.css';
import thumbnailsStyles from './plugins/thumbnails/thumbnails.module.css';
import zoomWrapperStyles from './plugins/zoom/zoom-wrapper.module.css';

/** Hashed CSS module class names for internal DOM queries */
export const domClasses = {
  portal: portalStyles.portal,
  container: controllerStyles.container,
  toolbar: toolbarStyles.toolbar,
  slide: carouselStyles.slide,
  slideCurrent: carouselStyles.current,
  slideWrapper: zoomWrapperStyles.wrapper,
  noScrollPadding: portalStyles.noScrollPadding,
  thumbnail: thumbnailsStyles.thumbnail,
  thumbnailsContainer: thumbnailsStyles.container,
  thumbnailsHidden: thumbnailsStyles.hidden,
  button: buttonStyles.button,
} as const;

export function hasDomClass(element: Element, className: string) {
  return element.classList.contains(className);
}

export function closestDomClass(element: Element | null, className: string) {
  return element?.closest(`.${CSS.escape(className)}`) ?? null;
}

import * as React from 'react';

import type {
  ACTION_CLOSE,
  ACTION_NEXT,
  ACTION_PREV,
  ACTION_SWIPE,
  ACTIVE_SLIDE_COMPLETE,
  ACTIVE_SLIDE_ERROR,
  ACTIVE_SLIDE_LOADING,
  ACTIVE_SLIDE_PLAYING,
} from './consts';

/** Lightbox external props */
export type LightboxExternalProps = DeepPartial<
  DeepPartial<
    DeepPartial<LightboxProps, 'animation' | 'toolbar' | 'noScroll'>,
    'carousel',
    'imageProps'
  >,
  'controller',
  'ref'
>;

/** Lightbox properties */
export interface LightboxProps {
  // TODO v4: consider https://github.com/igordanchenko/yet-another-react-lightbox/issues/374
  /** if `true`, the lightbox is open */
  open: boolean;
  /** a callback to close the lightbox */
  close: Callback;
  /** starting slide index */
  index: number;
  /** slides to display in the lightbox */
  slides: readonly Slide[];
  /** custom render functions */
  render: Render;
  /** custom UI labels / translations */
  labels: Labels;
  /** enabled plugins */
  plugins: readonly Plugin[];
  /** toolbar settings */
  toolbar: ToolbarSettings;
  /** carousel settings */
  carousel: CarouselSettings;
  /** animation settings */
  animation: AnimationSettings;
  /** controller settings */
  controller: ControllerSettings;
  /** portal settings */
  portal: PortalSettings;
  /** NoScroll module settings */
  noScroll: NoScrollSettings;
  /** lifecycle callbacks */
  on: Callbacks;
  /** per-part inline styles */
  styles: LightboxStyles;
  /** per-part class names (e.g. host Tailwind utilities) */
  classNames: LightboxClassNames;
  /** CSS class of the lightbox root element */
  className: string;
  /** Counter plugin settings */
  counter?: CounterSettings;
  /** Captions plugin settings */
  captions?: CaptionsSettings;
  /** Zoom plugin settings */
  zoom?: ZoomSettings;
  /** Thumbnails plugin settings */
  thumbnails?: ThumbnailsSettings;
  /** Fullscreen plugin settings */
  fullscreen?: FullscreenSettings;
  /** Slideshow plugin settings */
  slideshow?: SlideshowSettings;
  /** HTML div element attributes for the Inline plugin container */
  inline?: React.HTMLAttributes<HTMLDivElement>;
  /** Download plugin settings */
  download?: DownloadSettings;
}

/** Slide */
export type Slide = SlideTypes[SlideTypeKey];

/** Supported slide types */
export interface SlideTypes {
  /** image slide type */
  image: SlideImage;
}

/** Slide type key */
export type SlideTypeKey = keyof SlideTypes;

/** Generic slide */
export interface GenericSlide {
  type?: SlideTypeKey;
  /** slide title */
  title?: React.ReactNode;
  /** slide description */
  description?: React.ReactNode;
  /** thumbnail image */
  thumbnail?: string;
  /** download url or download props */
  download?:
    | boolean
    | string
    | {
        /** download url */
        url: string;
        /** download filename override */
        filename: string;
      };
}

/** Image slide properties */
export interface SlideImage extends GenericSlide {
  /** image slide type */
  type?: 'image';
  /** image URL */
  src: string;
  /** image 'alt' attribute */
  alt?: string;
  /** image width in pixels */
  width?: number;
  /** image height in pixels */
  height?: number;
  /** `object-fit` setting */
  imageFit?: ImageFit;
  /** alternative images to be passed to the 'srcSet' */
  srcSet?: readonly ImageSource[];
}

/** Image source */
export interface ImageSource {
  /** image URL */
  src: string;
  /** image width in pixels */
  width: number;
  /** image height in pixels */
  height: number;
}

/** Image fit setting */
export type ImageFit = 'contain' | 'cover';

/** Lightbox component */
export type Component = React.ComponentType<ComponentProps>;

/** Lightbox component properties */
export type ComponentProps = React.PropsWithChildren<
  Omit<LightboxProps, 'slides' | 'index' | 'plugins'>
>;

/** Lightbox component tree node */
export interface Node {
  /** module */
  module: Module;
  /** module child nodes */
  children?: Node[];
}

/** Lightbox module */
export interface Module {
  /** module name */
  name: string;
  /** module component */
  component: Component;
}

/** Lightbox props augmentation */
export type Augmentation = (props: ComponentProps) => ComponentProps;

/** Container rect */
export interface ContainerRect {
  width: number;
  height: number;
}

/** Style / className keys for lightbox parts */
export type LightboxStyleKey = LightboxStyleKeyType[keyof LightboxStyleKeyType];

/** Supported style keys */
export interface LightboxStyleKeyType {
  root: 'root';
  container: 'container';
  slide: 'slide';
  button: 'button';
  icon: 'icon';
  toolbar: 'toolbar';
  navigationPrev: 'navigationPrev';
  navigationNext: 'navigationNext';
  captionsTitle: 'captionsTitle';
  captionsTitleContainer: 'captionsTitleContainer';
  captionsDescription: 'captionsDescription';
  captionsDescriptionContainer: 'captionsDescriptionContainer';
  thumbnail: 'thumbnail';
  thumbnailsTrack: 'thumbnailsTrack';
  thumbnailsContainer: 'thumbnailsContainer';
}

/** Per-part inline styles */
export type LightboxStyles = Partial<
  Record<LightboxStyleKey, React.CSSProperties>
>;

/** Per-part class names */
export type LightboxClassNames = Partial<Record<LightboxStyleKey, string>>;

/** @deprecated Use {@link LightboxStyleKey} */
export type Slot = LightboxStyleKey;

/** @deprecated Use {@link LightboxStyles} */
export type SlotStyles = LightboxStyles;

/** Carousel settings */
export interface CarouselSettings {
  /** if `true`, the lightbox carousel doesn't wrap around */
  finite: boolean;
  /** the lightbox preloads (2 * preload + 1) slides */
  preload: number;
  /** padding around each slide (e.g., "16px", "10%" or 0) */
  padding: LengthOrPercentage;
  /** spacing between slides (e.g., "100px", "50%" or 0) */
  spacing: LengthOrPercentage;
  /** `object-fit` setting for image slides */
  imageFit: ImageFit;
  /** custom image attributes */
  imageProps: ImageProps | ((slide: Slide) => ImageProps);
}

export type LengthOrPercentage = `${number}px` | `${number}%` | number;

export type ImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt' | 'sizes' | 'srcSet' | 'onLoad' | 'onError' | 'onClick'
>;

/** Animation settings */
export interface AnimationSettings {
  /** fade-in / fade-out animation settings */
  fade: number;
  /** swipe animation settings */
  swipe: number;
  /** override for `swipe` animation settings when using keyboard navigation or navigation buttons */
  navigation?: number;
  /** animation timing function settings */
  easing: {
    /** fade-in / fade-out animation timing function */
    fade: string;
    /** slide swipe animation timing function */
    swipe: string;
    /** slide navigation animation timing function (when using keyboard navigation or navigation buttons) */
    navigation: string;
  };
  /** zoom animation duration */
  zoom?: number;
}

/** Controller settings */
export interface ControllerSettings {
  /** controller ref */
  ref: React.ForwardedRef<ControllerRef>;
  // TODO v4: remove
  /** @deprecated for internal use only */
  focus: boolean;
  // TODO v4: remove
  /** @deprecated for internal use only */
  touchAction: 'none' | 'pan-y';
  // TODO v4: remove
  /** @deprecated for internal use only */
  aria: boolean;
  /** if `true`, close the lightbox on pull-up gesture */
  closeOnPullUp: boolean;
  /** if `true`, close the lightbox on pull-down gesture */
  closeOnPullDown: boolean;
  /** if `true`, close the lightbox when the backdrop is clicked */
  closeOnBackdropClick: boolean;
  /** if `true`, close the lightbox on Escape key press (default: `true`) */
  closeOnEscape: boolean;
  /** if `true`, prevent default for horizontal wheel scroll events (for internal use only) */
  preventDefaultWheelX: boolean;
  /** if `true`, prevent default for vertical wheel scroll events (for internal use only) */
  preventDefaultWheelY: boolean;
  /** if `true`, disable slide change on pointer swipe / drag */
  disableSwipeNavigation: boolean;
}

/** Lightbox controller ref */
export interface ControllerRef {
  /** navigate to the previous slide */
  prev: Callback<NavigationAction | void>;
  /** navigate to the next slide */
  next: Callback<NavigationAction | void>;
  /** close the lightbox */
  close: Callback;
  /** transfer focus to the lightbox controller */
  focus: Callback;
  /** get lightbox props */
  getLightboxProps: () => ComponentProps;
  /** get lightbox state */
  getLightboxState: () => LightboxState;
}

/** Portal settings */
export interface PortalSettings {
  /** portal mount point */
  root?:
    | (() => DocumentFragment | Element | null)
    | DocumentFragment
    | Element
    | null;
  /** HTML attributes for the portal container */
  container?: React.HTMLAttributes<HTMLDivElement>;
}

/** NoScroll module settings */
export interface NoScrollSettings {
  /** if `true`, the NoScroll module functionality is disabled */
  disabled: boolean;
}

/** Lightbox navigation action */
export interface NavigationAction {
  /** navigate through the specified number of slides */
  count?: number;
}

/** Lightbox state swipe action */
export interface LightboxStateSwipeAction {
  type: 'swipe';
  increment: number;
  duration?: number;
  easing?: string;
}

/** Lightbox state update action */
export interface LightboxStateUpdateAction {
  type: 'update';
  slides: readonly Slide[];
  index: number;
}

/** Lightbox state */
export interface LightboxState {
  /** lightbox slides */
  slides: readonly Slide[];
  /** current slide index */
  currentIndex: number;
  /** current slide index in the (-∞, +∞) range */
  globalIndex: number;
  /** current slide */
  currentSlide: Slide | undefined;
  /** current animation */
  animation?: { increment?: number; duration?: number; easing?: string };
}

/** Render function */
export type RenderFunction<T = void> = [T] extends [void]
  ? () => React.ReactNode
  : (props: T) => React.ReactNode;

/** `render.slide` render function props */
export interface RenderSlideProps<S extends Slide = Slide> {
  /** slide */
  slide: S;
  /** slide offset (`0` - current slide, `1` - next slide, `-1` - previous slide, etc.) */
  offset: number;
  /** container rect */
  rect: ContainerRect;
  /** current zoom level */
  zoom?: number;
  /** maximum zoom level */
  maxZoom?: number;
}

/** `render.slideHeader` render function props */
export interface RenderSlideHeaderProps {
  slide: Slide;
}

/** `render.slideFooter` render function props */
export interface RenderSlideFooterProps {
  slide: Slide;
}

/** `render.slideContainer` render function props */
export interface RenderSlideContainerProps extends React.PropsWithChildren {
  slide: Slide;
}

/** Custom render functions. */
export interface Render {
  /** render custom slide type, or override the default image slide */
  slide?: RenderFunction<RenderSlideProps>;
  /** render custom slide header (use absolute positioning) */
  slideHeader?: RenderFunction<RenderSlideHeaderProps>;
  /** render custom slide footer (use absolute positioning) */
  slideFooter?: RenderFunction<RenderSlideFooterProps>;
  /** render custom slide container */
  slideContainer?: RenderFunction<RenderSlideContainerProps>;
  /** render custom controls or additional elements in the lightbox (use absolute positioning) */
  controls?: RenderFunction;
  /** render custom Prev icon */
  iconPrev?: RenderFunction;
  /** render custom Next icon */
  iconNext?: RenderFunction;
  /** render custom Close icon */
  iconClose?: RenderFunction;
  /** render custom Loading icon */
  iconLoading?: RenderFunction;
  /** render custom Error icon */
  iconError?: RenderFunction;
  /** render custom Prev button */
  buttonPrev?: RenderFunction;
  /** render custom Next button */
  buttonNext?: RenderFunction;
  /** render custom Close button */
  buttonClose?: RenderFunction;
  /** render custom Captions Visible icon */
  iconCaptionsVisible?: RenderFunction;
  /** render custom Captions Hidden icon */
  iconCaptionsHidden?: RenderFunction;
  /** render custom Captions button */
  buttonCaptions?: RenderFunction<CaptionsRef>;
  /** render custom Zoom control in the toolbar */
  buttonZoom?: RenderFunction<ZoomRef>;
  /** render custom Zoom In icon */
  iconZoomIn?: RenderFunction;
  /** render custom Zoom Out icon */
  iconZoomOut?: RenderFunction;
  /** render custom thumbnail */
  thumbnail?: RenderFunction<RenderThumbnailProps>;
  /** render custom Thumbnails Visible icon */
  iconThumbnailsVisible?: RenderFunction;
  /** render custom Thumbnails Hidden icon */
  iconThumbnailsHidden?: RenderFunction;
  /** render custom Thumbnails button */
  buttonThumbnails?: RenderFunction<ThumbnailsRef>;
  /** render custom Enter/Exit Fullscreen button */
  buttonFullscreen?: RenderFunction<FullscreenRef>;
  /** render custom Enter Fullscreen icon */
  iconEnterFullscreen?: RenderFunction;
  /** render custom Exit Fullscreen icon */
  iconExitFullscreen?: RenderFunction;
  /** render custom Slideshow Play icon */
  iconSlideshowPlay?: RenderFunction;
  /** render custom Slideshow Pause icon */
  iconSlideshowPause?: RenderFunction;
  /** render custom Slideshow button */
  buttonSlideshow?: RenderFunction<SlideshowRef>;
  /** render custom Download button */
  buttonDownload?: RenderFunction;
  /** render custom Download icon */
  iconDownload?: RenderFunction;
}

export type Callback<T = void> = [T] extends [void]
  ? () => void
  : (props: T) => void;

export interface ViewCallbackProps {
  index: number;
}

export interface ClickCallbackProps {
  index: number;
}

/** Lifecycle callbacks */
export interface Callbacks {
  /** a callback called when a slide becomes active */
  view?: Callback<ViewCallbackProps>;
  /** a callback called when a slide is clicked */
  click?: Callback<ClickCallbackProps>;
  /** a callback called when the portal starts opening */
  entering?: Callback;
  /** a callback called when the portal opens */
  entered?: Callback;
  /** a callback called when the portal starts closing */
  exiting?: Callback;
  /** a callback called when the portal closes */
  exited?: Callback;
  /** zoom callback */
  zoom?: Callback<ZoomCallbackProps>;
  /** a callback called when the lightbox enters fullscreen mode */
  enterFullscreen?: Callback;
  /** a callback called when the lightbox exits fullscreen mode */
  exitFullscreen?: Callback;
  /** a callback called on slideshow playback start */
  slideshowStart?: Callback;
  /** a callback called on slideshow playback stop */
  slideshowStop?: Callback;
  /** a callback called on slide download */
  download?: Callback<DownloadCallbackProps>;
}

/** Custom UI labels / translations / localization */
export interface Labels {
  /** `Previous` button title */
  Previous?: string;
  /** `Next` button title */
  Next?: string;
  /** `Close` button title */
  Close?: string;
  /** Slide ARIA role description */
  Slide?: string;
  /** Carousel ARIA role description */
  Carousel?: string;
  /** Lightbox ARIA label */
  Lightbox?: string;
  /** Carousel ARIA label */
  'Photo gallery'?: string;
  /**
   * Slide ARIA label
   *
   * The value is a template string supporting the following placeholders:
   * - {index} - current slide index
   * - {total} - total number of slides
   */
  '{index} of {total}'?: string;
  /** Slide description ARIA role description */
  Caption?: string;
  /** `Show captions` button title */
  'Show captions'?: string;
  /** `Hide captions` button title */
  'Hide captions'?: string;
  /** `Zoom in` button title */
  'Zoom in'?: string;
  /** `Zoom out` button title */
  'Zoom out'?: string;
  /** Thumbnails ARIA label */
  Thumbnails?: string;
  /** `Show thumbnails` button title */
  'Show thumbnails'?: string;
  /** `Hide thumbnails` button title */
  'Hide thumbnails'?: string;
  /** `Enter Fullscreen` button title */
  'Enter Fullscreen'?: string;
  /** `Exit Fullscreen` button title */
  'Exit Fullscreen'?: string;
  /** `Play` button title */
  Play?: string;
  /** `Pause` button title */
  Pause?: string;
  /** `Download` button title */
  Download?: string;
}

export type Label = keyof Labels;

/** Toolbar settings */
export interface ToolbarSettings {
  /** buttons to render in the toolbar */
  buttons: readonly (ToolbarButtonKey | React.ReactNode)[];
}

export type ToolbarButtonKey = keyof ToolbarButtonKeys;

export interface ToolbarButtonKeys {
  close: null;
  captions: null;
  download: null;
  fullscreen: null;
  slideshow: null;
  thumbnails: null;
  zoom: null;
}

export interface EventTypes {
  [ACTION_PREV]: NavigationAction | void;
  [ACTION_NEXT]: NavigationAction | void;
  [ACTION_SWIPE]: LightboxStateSwipeAction;
  [ACTION_CLOSE]: void;

  [ACTIVE_SLIDE_LOADING]: void;
  [ACTIVE_SLIDE_PLAYING]: void;
  [ACTIVE_SLIDE_COMPLETE]: void;
  [ACTIVE_SLIDE_ERROR]: void;
}

/** Plugin methods */
export interface PluginProps {
  /** test if a target module is present */
  contains: (target: string) => boolean;
  /** add module as a parent */
  addParent: (target: string, module: Module) => void;
  /** add module as a child */
  addChild: (target: string, module: Module, precede?: boolean) => void;
  /** add module as a sibling */
  addSibling: (target: string, module: Module, precede?: boolean) => void;
  /** append module to the Controller module */
  addModule: (module: Module) => void;
  /** replace module */
  replace: (target: string, module: Module) => void;
  /** add module as a child and inherit all existing children */
  append: (target: string, module: Module) => void;
  /** remove module */
  remove: (target: string) => void;
  /** augment lightbox props */
  augment: (augmentation: Augmentation) => void;
}

/** Lightbox plugin */
export type Plugin = (props: PluginProps) => void;

/** Deep partial utility type */
export type DeepPartial<
  T extends object,
  K extends keyof T = keyof T,
  E extends string = never,
> = Omit<Partial<T>, K> & {
  [P in K]?: DeepPartialValue<T[P], E>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeepPartialValue<
  T,
  E extends string = never,
> = T extends readonly any[]
  ? T
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends (...props: any[]) => any
    ? T
    : T extends object
      ? {
          [P in keyof T]?: P extends E ? T[P] : DeepPartialValue<T[P], E>;
        }
      : T;

/** Counter plugin settings */
export interface CounterSettings {
  /** custom separator */
  separator?: string;
  /** counter container HTML attributes */
  container?: React.HTMLAttributes<HTMLDivElement>;
}

/** Captions plugin settings */
export interface CaptionsSettings {
  /** Captions plugin ref */
  ref?: React.ForwardedRef<CaptionsRef>;
  /** if `true`, captions are hidden when the lightbox opens */
  hidden?: boolean;
  /** if `true`, show Captions Toggle button in the toolbar */
  showToggle?: boolean;
  /** description text alignment */
  descriptionTextAlign?: 'start' | 'end' | 'center';
  /** maximum number of lines to display in the description section */
  descriptionMaxLines?: number;
}

/** Captions plugin ref */
export interface CaptionsRef {
  /** if `true`, captions are visible */
  visible: boolean;
  /** show captions */
  show: Callback;
  /** hide captions */
  hide: Callback;
}

/** Zoom plugin settings */
export interface ZoomSettings {
  /** Zoom plugin ref */
  ref?: React.ForwardedRef<ZoomRef>;
  /** override minimum zoom level (default: 1.0) */
  minZoom?: number;
  /** ratio of image pixels to physical pixels at maximum zoom level */
  maxZoomPixelRatio?: number;
  /** zoom-in multiplier */
  zoomInMultiplier?: number;
  /** maximum number of zoom-in stops via double-click or double-tap */
  doubleClickMaxStops?: number;
  /** keyboard move distance */
  keyboardMoveDistance?: number;
  /** wheel zoom distance factor */
  wheelZoomDistanceFactor?: number;
  /** if `true`, enables image zoom via scroll gestures for mouse and trackpad users */
  scrollToZoom?: boolean;
  /** custom slide types that support zoom */
  supports?: readonly SlideTypeKey[];
  /** maximum zoom level for custom slide types; when a function, return `undefined` to use the default (default: 8) */
  maxZoom?: number | ((slide: Slide) => number | undefined);
}

/** Zoom callback props */
export interface ZoomCallbackProps {
  /** current zoom level */
  zoom: number;
}

/** Zoom plugin ref */
export interface ZoomRef {
  /** current zoom level */
  zoom: number;
  /** minimum zoom level */
  minZoom: number;
  /** maximum zoom level */
  maxZoom: number;
  /** horizontal offset */
  offsetX: number;
  /** vertical offset */
  offsetY: number;
  /** if `true`, zoom is unavailable for the current slide */
  disabled: boolean;
  /** increase zoom level using `zoomInMultiplier` */
  zoomIn: Callback;
  /** decrease zoom level using `zoomInMultiplier` */
  zoomOut: Callback;
  /** change zoom level */
  changeZoom: (
    targetZoom: number,
    rapid?: boolean,
    dx?: number,
    dy?: number
  ) => void;
}

/** Thumbnails plugin settings */
export interface ThumbnailsSettings {
  /** Thumbnails plugin ref */
  ref?: React.ForwardedRef<ThumbnailsRef>;
  /** thumbnails position */
  position?: 'top' | 'bottom' | 'start' | 'end';
  /** thumbnail width */
  width?: number;
  /** thumbnail height */
  height?: number;
  /** thumbnail border width */
  border?: number;
  /** thumbnail border style */
  borderStyle?: string;
  /** thumbnail border color */
  borderColor?: string;
  /** thumbnail border radius */
  borderRadius?: number;
  /** thumbnail inner padding */
  padding?: number;
  /** gap between thumbnails */
  gap?: number;
  /** `object-fit` setting */
  imageFit?: ImageFit;
  /** if `true`, show the vignette effect on the edges of the thumbnails track */
  vignette?: boolean;
  /** if `true`, thumbnails are hidden when the lightbox opens */
  hidden?: boolean;
  /** if `true`, show the Toggle Thumbnails button in the toolbar */
  showToggle?: boolean;
}

/** `render.thumbnail` render function props */
export interface RenderThumbnailProps {
  slide: Slide;
  rect: ContainerRect;
  render: Render;
  imageFit: ImageFit;
}

/** Thumbnails plugin ref */
export interface ThumbnailsRef {
  /** if `true`, thumbnails are visible */
  visible: boolean;
  /** show thumbnails */
  show: Callback;
  /** hide thumbnails */
  hide: Callback;
}

/** Fullscreen plugin settings */
export interface FullscreenSettings {
  /** Fullscreen plugin ref */
  ref?: React.ForwardedRef<FullscreenRef>;
  /** if `true`, enter fullscreen mode automatically when the lightbox opens */
  auto?: boolean;
}

/** Fullscreen plugin ref */
export interface FullscreenRef {
  /** current fullscreen status */
  fullscreen: boolean;
  /** if `true`, fullscreen features are not available */
  disabled: boolean | undefined;
  /** enter fullscreen mode */
  enter: Callback;
  /** exit fullscreen mode */
  exit: Callback;
}

/** Slideshow plugin settings */
export interface SlideshowSettings {
  /** Slideshow plugin ref */
  ref?: React.ForwardedRef<SlideshowRef>;
  /** if `true`, slideshow is turned on automatically when the lightbox opens */
  autoplay?: boolean;
  /** slideshow delay in milliseconds */
  delay?: number;
}

/** Slideshow plugin ref */
export interface SlideshowRef {
  /** current slideshow playback status */
  playing: boolean;
  /** if `true`, the slideshow playback is disabled */
  disabled: boolean;
  /** start the slideshow playback */
  play: Callback;
  /** pause the slideshow playback */
  pause: Callback;
}

/** Download plugin settings */
export interface DownloadSettings {
  /** Custom download function */
  download?: ({ slide, saveAs }: DownloadFunctionProps) => void;
}

export interface DownloadCallbackProps {
  index: number;
}

export interface DownloadFunctionProps {
  slide: Slide;
  saveAs: (source: string | Blob, name?: string) => void;
}

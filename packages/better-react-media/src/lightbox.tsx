import * as React from 'react';

import { createNode, withPlugins } from './config';
import {
  A11yContextProvider,
  EventsProvider,
  LightboxPropsProvider,
  LightboxStateProvider,
  TimeoutsProvider,
} from './contexts/index';
import {
  CarouselModule,
  ControllerModule,
  NavigationModule,
  NoScrollModule,
  PortalModule,
  RootModule,
  ToolbarModule,
} from './modules/index';
import { LightboxDefaultProps } from './props';
import type {
  AnimationSettings,
  ComponentProps,
  LightboxExternalProps,
  Node,
} from './types';
import { parseInt } from './utils';

function renderNode(node: Node, props: ComponentProps): React.ReactElement {
  return React.createElement(
    node.module.component,
    { key: node.module.name, ...props },
    node.children?.map((child) => renderNode(child, props))
  );
}

function mergeAnimation(
  defaultAnimation: AnimationSettings,
  animation: LightboxExternalProps['animation'] = {}
) {
  const { easing: defaultAnimationEasing, ...restDefaultAnimation } =
    defaultAnimation;
  const { easing, ...restAnimation } = animation;
  return {
    easing: { ...defaultAnimationEasing, ...easing },
    ...restDefaultAnimation,
    ...restAnimation,
  };
}

/** Lightbox component */
export function Lightbox({
  carousel,
  animation,
  render,
  toolbar,
  controller,
  noScroll,
  on,
  plugins,
  slides,
  index,
  ...restProps
}: LightboxExternalProps) {
  const {
    animation: defaultAnimation,
    carousel: defaultCarousel,
    render: defaultRender,
    toolbar: defaultToolbar,
    controller: defaultController,
    noScroll: defaultNoScroll,
    on: defaultOn,
    slides: defaultSlides,
    index: defaultIndex,
    plugins: defaultPlugins,
    ...restDefaultProps
  } = LightboxDefaultProps;

  const { config, augmentation } = withPlugins(
    [
      createNode(PortalModule, [
        createNode(NoScrollModule, [
          createNode(ControllerModule, [
            createNode(CarouselModule),
            createNode(ToolbarModule),
            createNode(NavigationModule),
          ]),
        ]),
      ]),
    ],
    plugins || defaultPlugins
  );

  const props = augmentation({
    animation: mergeAnimation(defaultAnimation, animation),
    carousel: { ...defaultCarousel, ...carousel },
    controller: { ...defaultController, ...controller },
    noScroll: { ...defaultNoScroll, ...noScroll },
    on: { ...defaultOn, ...on },
    render: { ...defaultRender, ...render },
    toolbar: { ...defaultToolbar, ...toolbar },
    ...restDefaultProps,
    ...restProps,
  });

  if (!props.open) {
    return null;
  }

  return (
    <LightboxPropsProvider {...props}>
      <LightboxStateProvider
        slides={slides || defaultSlides}
        // safeguard against invalid `index` prop
        index={parseInt(index || defaultIndex)}
      >
        <TimeoutsProvider>
          <EventsProvider>
            <A11yContextProvider>
              {renderNode(createNode(RootModule, config), props)}
            </A11yContextProvider>
          </EventsProvider>
        </TimeoutsProvider>
      </LightboxStateProvider>
    </LightboxPropsProvider>
  );
}

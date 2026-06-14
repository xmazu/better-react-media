import * as React from 'react';

import { cn } from '../../cn';
import { createModule } from '../../config';
import {
  ACTION_CLOSE,
  ACTION_NEXT,
  ACTION_PREV,
  ACTION_SWIPE,
  DATA_LIGHTBOX,
  MODULE_CONTROLLER,
} from '../../consts';
import {
  useDocumentContext,
  useEvents,
  useLightboxDispatch,
  useLightboxState,
} from '../../contexts/index';
import { domClasses } from '../../dom-classes';
import type { SubscribeSensors } from '../../hooks/index';
import {
  useAnimation,
  useContainerRect,
  useDelay,
  useEventCallback,
  useForkRef,
  useSensors,
} from '../../hooks/index';
import type {
  Callback,
  ComponentProps,
  ContainerRect,
  ControllerRef,
} from '../../types';
import {
  cleanup,
  computeSlideRect,
  makeUseContext,
  parseLengthPercentage,
  round,
} from '../../utils';
import { SwipeState } from './swipe-state';
import { usePointerSwipe } from './use-pointer-swipe';
import { usePreventWheelDefaults } from './use-prevent-wheel-defaults';
import { useWheelSwipe } from './use-wheel-swipe';

import controllerStyles from './controller.module.css';

export type ControllerContextType = Pick<
  ControllerRef,
  'prev' | 'next' | 'close'
> & {
  focus: Callback;
  slideRect: ContainerRect;
  containerRect: ContainerRect;
  subscribeSensors: SubscribeSensors<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setCarouselRef: React.Ref<HTMLDivElement>;
  toolbarWidth: number | undefined;
  setToolbarWidth: (width: number | undefined) => void;
};

export const ControllerContext =
  React.createContext<ControllerContextType | null>(null);

export const useController = makeUseContext(
  'useController',
  'ControllerContext',
  ControllerContext
);

function applyCarouselTransform(
  carousel: HTMLDivElement | null,
  swipeOffset: number,
  pullOffset: number,
  pullOpacity: number
) {
  if (!carousel) {
    return;
  }
  carousel.style.transform = `translate(${Math.round(swipeOffset)}px, ${Math.round(pullOffset)}px)`;
  carousel.style.opacity = `${pullOpacity}`;
}

export function Controller({ children, ...props }: ComponentProps) {
  const { carousel, animation, controller, on, styles, classNames, render } =
    props;
  const {
    closeOnPullUp,
    closeOnPullDown,
    preventDefaultWheelX,
    preventDefaultWheelY,
  } = controller;

  const [toolbarWidth, setToolbarWidth] = React.useState<number>();

  const state = useLightboxState();
  const dispatch = useLightboxDispatch();

  const [swipeState, setSwipeState] = React.useState(SwipeState.NONE);
  const swipeOffset = React.useRef(0);
  const pullOffset = React.useRef(0);
  const pullOpacity = React.useRef(1);

  const { registerSensors, subscribeSensors } = useSensors<HTMLDivElement>();
  const { subscribe, publish } = useEvents();

  const cleanupAnimationIncrement = useDelay();
  const cleanupSwipeOffset = useDelay();
  const cleanupPullOffset = useDelay();

  const { containerRef, setContainerRef, containerRect } =
    useContainerRect<HTMLDivElement>();
  const handleContainerRef = useForkRef(
    usePreventWheelDefaults({ preventDefaultWheelX, preventDefaultWheelY }),
    setContainerRef
  );

  const carouselRef = React.useRef<HTMLDivElement>(null);
  const setCarouselRef = useForkRef(carouselRef);

  const { getOwnerDocument } = useDocumentContext();

  const focus = useEventCallback(() => containerRef.current?.focus());

  const getLightboxProps = useEventCallback(() => props);
  const getLightboxState = useEventCallback(() => state);

  const prev: ControllerRef['prev'] = React.useCallback(
    (params) => publish(ACTION_PREV, params),
    [publish]
  );
  const next: ControllerRef['next'] = React.useCallback(
    (params) => publish(ACTION_NEXT, params),
    [publish]
  );
  const close: ControllerRef['close'] = React.useCallback(
    () => publish(ACTION_CLOSE),
    [publish]
  );

  const isSwipeValid = (offset: number) =>
    !(
      carousel.finite &&
      ((offset > 0 && state.currentIndex === 0) ||
        (offset < 0 && state.currentIndex === state.slides.length - 1))
    );

  const setSwipeOffset = (offset: number) => {
    swipeOffset.current = offset;
    applyCarouselTransform(
      carouselRef.current,
      offset,
      pullOffset.current,
      pullOpacity.current
    );
  };

  const setPullOffset = (offset: number) => {
    pullOffset.current = offset;
    pullOpacity.current = (() => {
      const threshold = 60;
      const minOpacity = 0.5;
      const offsetValue = (() => {
        if (closeOnPullDown && offset > 0) {
          return offset;
        }
        if (closeOnPullUp && offset < 0) {
          return -offset;
        }
        return 0;
      })();
      return Math.min(
        Math.max(
          round(1 - (offsetValue / threshold) * (1 - minOpacity), 2),
          minOpacity
        ),
        1
      );
    })();

    applyCarouselTransform(
      carouselRef.current,
      swipeOffset.current,
      offset,
      pullOpacity.current
    );
  };

  const { prepareAnimation: preparePullAnimation } = useAnimation<{
    rect: DOMRect;
    opacity: number;
    duration: number;
  }>(carouselRef, (snapshot, rect, translate) => {
    if (carouselRef.current && containerRect) {
      return {
        duration: snapshot.duration,
        easing: animation.easing.fade,
        keyframes: [
          {
            opacity: snapshot.opacity,
            transform: `translate(0, ${snapshot.rect.y - rect.y + translate.y}px)`,
          },
          { opacity: 1, transform: 'translate(0, 0)' },
        ],
      };
    }
  });

  const pull = (offset: number, cancel?: boolean) => {
    if (closeOnPullUp || closeOnPullDown) {
      setPullOffset(offset);

      let duration = 0;

      if (carouselRef.current) {
        duration = animation.fade * (cancel ? 2 : 1);

        preparePullAnimation({
          duration,
          opacity: pullOpacity.current,
          rect: carouselRef.current.getBoundingClientRect(),
        });
      }

      cleanupPullOffset(() => {
        setPullOffset(0);
        setSwipeState(SwipeState.NONE);
      }, duration);

      setSwipeState(SwipeState.ANIMATION);

      if (!cancel) {
        close();
      }
    }
  };

  const { prepareAnimation, isAnimationPlaying } = useAnimation<{
    rect: DOMRect;
    index: number;
  }>(carouselRef, (snapshot, rect, translate) => {
    if (carouselRef.current && containerRect && state.animation?.duration) {
      const parsedSpacing = parseLengthPercentage(carousel.spacing);
      const spacingValue =
        (parsedSpacing.percent
          ? (parsedSpacing.percent * containerRect.width) / 100
          : parsedSpacing.pixel) || 0;

      return {
        duration: state.animation.duration,
        easing: state.animation.easing,
        keyframes: [
          {
            transform: `translate(${
              (state.globalIndex - snapshot.index) *
                (containerRect.width + spacingValue) +
              snapshot.rect.x -
              rect.x +
              translate.x
            }px, 0)`,
          },
          { transform: 'translate(0, 0)' },
        ],
      };
    }
  });

  const swipe = useEventCallback(
    (action: {
      direction?: 'prev' | 'next';
      count?: number;
      offset?: number;
      duration?: number;
    }) => {
      const currentSwipeOffset = action.offset || 0;
      const swipeDuration = !currentSwipeOffset
        ? (animation.navigation ?? animation.swipe)
        : animation.swipe;
      const swipeEasing =
        !currentSwipeOffset && !isAnimationPlaying()
          ? animation.easing.navigation
          : animation.easing.swipe;

      let { direction } = action;
      const count = action.count ?? 1;

      let newSwipeState = SwipeState.ANIMATION;
      let newSwipeAnimationDuration = swipeDuration * count;

      if (!direction) {
        const containerWidth = containerRect?.width;

        const elapsedTime = action.duration || 0;
        const expectedTime = containerWidth
          ? (swipeDuration / containerWidth) * Math.abs(currentSwipeOffset)
          : swipeDuration;

        if (count !== 0) {
          if (elapsedTime < expectedTime) {
            newSwipeAnimationDuration =
              (newSwipeAnimationDuration / expectedTime) *
              Math.max(elapsedTime, expectedTime / 5);
          } else if (containerWidth) {
            newSwipeAnimationDuration =
              (swipeDuration / containerWidth) *
              (containerWidth - Math.abs(currentSwipeOffset));
          }

          direction = currentSwipeOffset > 0 ? ACTION_PREV : ACTION_NEXT;
        } else {
          newSwipeAnimationDuration = swipeDuration / 2;
        }
      }

      let increment = 0;
      if (direction === ACTION_PREV) {
        if (isSwipeValid(1)) {
          increment = -count;
        } else {
          newSwipeState = SwipeState.NONE;
          newSwipeAnimationDuration = swipeDuration;
        }
      } else if (direction === ACTION_NEXT) {
        if (isSwipeValid(-1)) {
          increment = count;
        } else {
          newSwipeState = SwipeState.NONE;
          newSwipeAnimationDuration = swipeDuration;
        }
      }

      newSwipeAnimationDuration = Math.round(newSwipeAnimationDuration);

      cleanupSwipeOffset(() => {
        setSwipeOffset(0);
        setSwipeState(SwipeState.NONE);
      }, newSwipeAnimationDuration);

      if (carouselRef.current) {
        prepareAnimation({
          index: state.globalIndex,
          rect: carouselRef.current.getBoundingClientRect(),
        });
      }

      setSwipeState(newSwipeState);

      const swipeAction = {
        duration: newSwipeAnimationDuration,
        easing: swipeEasing,
        increment,
        type: 'swipe' as const,
      };

      publish(ACTION_SWIPE, swipeAction);
      dispatch(swipeAction);
    }
  );

  React.useEffect(() => {
    if (state.animation?.increment && state.animation?.duration) {
      cleanupAnimationIncrement(
        () => dispatch({ increment: 0, type: 'swipe' }),
        state.animation.duration
      );
    }
  }, [state.animation, dispatch, cleanupAnimationIncrement]);

  const swipeParams = [
    subscribeSensors,
    isSwipeValid,
    containerRect?.width || 0,
    animation.swipe,
    // onSwipeStart
    () => setSwipeState(SwipeState.SWIPE),
    // onSwipeProgress
    (offset: number) => setSwipeOffset(offset),
    // onSwipeFinish
    (offset: number, duration: number) => swipe({ count: 1, duration, offset }),
    // onSwipeCancel
    (offset: number) => swipe({ count: 0, offset }),
  ] as const;

  const pullParams = [
    // onPullStart
    () => {
      if (closeOnPullDown) {
        setSwipeState(SwipeState.PULL);
      }
    },
    // onPullProgress
    (offset: number) => setPullOffset(offset),
    // onPullFinish
    (offset: number) => pull(offset),
    // onPullCancel
    (offset: number) => pull(offset, true),
  ] as const;

  usePointerSwipe(
    controller,
    ...swipeParams,
    closeOnPullUp,
    closeOnPullDown,
    ...pullParams,
    close
  );

  useWheelSwipe(swipeState, ...swipeParams);

  const focusOnMount = useEventCallback(() => {
    // capture focus only when rendered inside a portal
    if (
      controller.focus &&
      getOwnerDocument().querySelector(
        `[${DATA_LIGHTBOX}] .${CSS.escape(domClasses.container)}`
      )
    ) {
      focus();
    }
  });

  React.useEffect(focusOnMount, [focusOnMount]);

  const onViewCallback = useEventCallback(() => {
    on.view?.({ index: state.currentIndex });
  });

  React.useEffect(onViewCallback, [state.globalIndex, onViewCallback]);

  React.useEffect(
    () =>
      cleanup(
        subscribe(ACTION_PREV, (action) =>
          swipe({ direction: ACTION_PREV, ...action })
        ),
        subscribe(ACTION_NEXT, (action) =>
          swipe({ direction: ACTION_NEXT, ...action })
        )
      ),
    [subscribe, swipe]
  );

  const context = React.useMemo<ControllerContextType>(
    () => ({
      prev,
      next,
      close,
      focus,
      // we are not going to render context provider when containerRect is undefined
      slideRect: containerRect
        ? computeSlideRect(containerRect, carousel.padding)
        : { height: 0, width: 0 },
      containerRect: containerRect || { height: 0, width: 0 },
      subscribeSensors,
      containerRef,
      setCarouselRef,
      toolbarWidth,
      setToolbarWidth,
    }),
    [
      prev,
      next,
      close,
      focus,
      subscribeSensors,
      containerRect,
      containerRef,
      setCarouselRef,
      toolbarWidth,
      setToolbarWidth,
      carousel.padding,
    ]
  );

  React.useImperativeHandle(
    controller.ref,
    () => ({
      close,
      focus,
      getLightboxProps,
      getLightboxState,
      next,
      prev,
    }),
    [prev, next, close, focus, getLightboxProps, getLightboxState]
  );

  return (
    <div
      ref={handleContainerRef}
      className={cn(controllerStyles.container, classNames.container)}
      style={{
        ...(controller.touchAction !== 'none'
          ? { touchAction: controller.touchAction }
          : null),
        ...styles.container,
      }}
      tabIndex={-1}
      {...registerSensors}
    >
      {containerRect && (
        <ControllerContext.Provider value={context}>
          {children}
          {render.controls?.()}
        </ControllerContext.Provider>
      )}
    </div>
  );
}

export const ControllerModule = createModule(MODULE_CONTROLLER, Controller);

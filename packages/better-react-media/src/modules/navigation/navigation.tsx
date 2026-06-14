import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../cn';
import { createModule } from '../../config';
import { ACTION_NEXT, ACTION_PREV, MODULE_NAVIGATION } from '../../consts';
import { useLoseFocus } from '../../hooks/index';
import type { ComponentProps, Label, RenderFunction } from '../../types';
import { useController } from '../controller/index';
import { ToolbarControl } from '../toolbar-control';
import { useKeyboardNavigation } from './use-keyboard-navigation';
import { useNavigationState } from './use-navigation-state';

import navigationStyles from './navigation.module.css';

export interface NavigationButtonProps {
  label: Label;
  icon: React.ReactNode;
  renderIcon?: RenderFunction;
  action: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function NavigationButton({
  label,
  icon,
  renderIcon,
  action,
  onClick,
  disabled,
  style,
  className,
}: NavigationButtonProps) {
  return (
    <ToolbarControl
      label={label}
      icon={icon}
      renderIcon={renderIcon}
      className={cn(
        navigationStyles.navigation,
        action === ACTION_PREV && navigationStyles.prev,
        action === ACTION_NEXT && navigationStyles.next,
        className
      )}
      disabled={disabled}
      onClick={onClick}
      style={style}
      {...useLoseFocus(useController().focus, disabled)}
    />
  );
}

export function Navigation({
  render: { buttonPrev, buttonNext, iconPrev, iconNext },
  styles,
  classNames,
}: ComponentProps) {
  const { prev, next, subscribeSensors } = useController();
  const { prevDisabled, nextDisabled } = useNavigationState();

  useKeyboardNavigation(subscribeSensors);

  return (
    <>
      {buttonPrev ? (
        buttonPrev()
      ) : (
        <NavigationButton
          label="Previous"
          action={ACTION_PREV}
          icon={<ChevronLeft />}
          renderIcon={iconPrev}
          style={styles.navigationPrev}
          className={classNames.navigationPrev}
          disabled={prevDisabled}
          onClick={prev}
        />
      )}

      {buttonNext ? (
        buttonNext()
      ) : (
        <NavigationButton
          label="Next"
          action={ACTION_NEXT}
          icon={<ChevronRight />}
          renderIcon={iconNext}
          style={styles.navigationNext}
          className={classNames.navigationNext}
          disabled={nextDisabled}
          onClick={next}
        />
      )}
    </>
  );
}

export const NavigationModule = createModule(MODULE_NAVIGATION, Navigation);

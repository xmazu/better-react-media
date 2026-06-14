import { useLightboxProps, useLightboxState } from '../../contexts/index';

export function useNavigationState() {
  const { carousel } = useLightboxProps();
  const { slides, currentIndex } = useLightboxState();

  const prevDisabled =
    slides.length === 0 || (carousel.finite && currentIndex === 0);
  const nextDisabled =
    slides.length === 0 ||
    (carousel.finite && currentIndex === slides.length - 1);

  return { nextDisabled, prevDisabled };
}

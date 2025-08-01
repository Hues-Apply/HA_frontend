import { useEffect, useState } from 'react';

// Breakpoint definitions (matching Tailwind CSS)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// Hook to get current breakpoint
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('sm');
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setWidth(windowWidth);

      if (windowWidth >= BREAKPOINTS['2xl']) {
        setBreakpoint('2xl');
      } else if (windowWidth >= BREAKPOINTS.xl) {
        setBreakpoint('xl');
      } else if (windowWidth >= BREAKPOINTS.lg) {
        setBreakpoint('lg');
      } else if (windowWidth >= BREAKPOINTS.md) {
        setBreakpoint('md');
      } else if (windowWidth >= BREAKPOINTS.sm) {
        setBreakpoint('sm');
      } else {
        setBreakpoint('sm');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { breakpoint, width };
};

// Hook to check if screen is mobile
export const useIsMobile = () => {
  const { breakpoint } = useBreakpoint();
  return breakpoint === 'sm';
};

// Hook to check if screen is tablet
export const useIsTablet = () => {
  const { breakpoint } = useBreakpoint();
  return breakpoint === 'md';
};

// Hook to check if screen is desktop
export const useIsDesktop = () => {
  const { breakpoint } = useBreakpoint();
  return breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl';
};

// Utility function to get responsive class names
export const getResponsiveClasses = (classes: {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}) => {
  const responsiveClasses: string[] = [];

  if (classes.sm) responsiveClasses.push(classes.sm);
  if (classes.md) responsiveClasses.push(`md:${classes.md}`);
  if (classes.lg) responsiveClasses.push(`lg:${classes.lg}`);
  if (classes.xl) responsiveClasses.push(`xl:${classes.xl}`);
  if (classes['2xl']) responsiveClasses.push(`2xl:${classes['2xl']}`);

  return responsiveClasses.join(' ');
};

// Utility function to get responsive values
export const getResponsiveValue = <T>(
  values: {
    sm: T;
    md?: T;
    lg?: T;
    xl?: T;
    '2xl'?: T;
  },
  currentBreakpoint: Breakpoint
): T => {
  const breakpointOrder: Breakpoint[] = ['sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

  for (let i = currentIndex; i >= 0; i--) {
    const breakpoint = breakpointOrder[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint]!;
    }
  }

  return values.sm;
};

// Utility function to check if element is in viewport
export const useInViewport = (ref: React.RefObject<HTMLElement>, threshold = 0.1) => {
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, threshold]);

  return isInViewport;
};

// Utility function to handle touch gestures
export const useTouchGesture = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold = 50
) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe && Math.abs(distanceX) > threshold) {
      if (distanceX > 0 && onSwipeLeft) {
        onSwipeLeft();
      } else if (distanceX < 0 && onSwipeRight) {
        onSwipeRight();
      }
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

// Utility function to handle keyboard navigation
export const useKeyboardNavigation = (
  items: any[],
  onSelect: (item: any, index: number) => void,
  initialIndex = 0
) => {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(items[selectedIndex], selectedIndex);
        break;
      case 'Home':
        e.preventDefault();
        setSelectedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setSelectedIndex(items.length - 1);
        break;
    }
  };

  return {
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
  };
};

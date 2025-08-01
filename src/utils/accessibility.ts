import { useRef, useEffect, useCallback, useState } from 'react';

// Focus management utilities
export const useFocusTrap = (isActive: boolean = true) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);

  return containerRef;
};

// Skip link utility
export const useSkipLink = (targetId: string) => {
  const handleSkipClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, [targetId]);

  return handleSkipClick;
};

// ARIA live region utility
export const useAriaLive = () => {
  const [message, setMessage] = useState<string>('');

  const announce = useCallback((text: string) => {
    setMessage(text);
    // Clear message after a short delay to allow screen readers to announce it
    setTimeout(() => setMessage(''), 100);
  }, []);

  return { message, announce };
};

// Keyboard navigation utility
export const useKeyboardNavigation = (
  items: any[],
  onSelect: (item: any, index: number) => void,
  initialIndex = 0
) => {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
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
  }, [items, selectedIndex, onSelect]);

  return {
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
  };
};

// Screen reader only text utility
export const srOnly = `
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// Focus visible utility
export const focusVisible = `
  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

// Common ARIA attributes
export const getAriaAttributes = (props: {
  label?: string;
  describedby?: string;
  controls?: string;
  expanded?: boolean;
  pressed?: boolean;
  selected?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  live?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: string;
  busy?: boolean;
}) => {
  const aria: Record<string, string | boolean> = {};

  if (props.label) aria['aria-label'] = props.label;
  if (props.describedby) aria['aria-describedby'] = props.describedby;
  if (props.controls) aria['aria-controls'] = props.controls;
  if (props.expanded !== undefined) aria['aria-expanded'] = props.expanded;
  if (props.pressed !== undefined) aria['aria-pressed'] = props.pressed;
  if (props.selected !== undefined) aria['aria-selected'] = props.selected;
  if (props.disabled !== undefined) aria['aria-disabled'] = props.disabled;
  if (props.required !== undefined) aria['aria-required'] = props.required;
  if (props.invalid !== undefined) aria['aria-invalid'] = props.invalid;
  if (props.live) aria['aria-live'] = props.live;
  if (props.atomic !== undefined) aria['aria-atomic'] = props.atomic;
  if (props.relevant) aria['aria-relevant'] = props.relevant;
  if (props.busy !== undefined) aria['aria-busy'] = props.busy;

  return aria;
};

// Role-based ARIA attributes
export const getRoleAttributes = (role: string, props: any = {}) => {
  const baseAttributes = getAriaAttributes(props);

  switch (role) {
    case 'button':
      return {
        ...baseAttributes,
        role: 'button',
        tabIndex: props.disabled ? -1 : 0,
      };
    case 'tab':
      return {
        ...baseAttributes,
        role: 'tab',
        tabIndex: props.selected ? 0 : -1,
      };
    case 'tabpanel':
      return {
        ...baseAttributes,
        role: 'tabpanel',
        tabIndex: 0,
      };
    case 'listbox':
      return {
        ...baseAttributes,
        role: 'listbox',
        tabIndex: 0,
      };
    case 'option':
      return {
        ...baseAttributes,
        role: 'option',
        tabIndex: -1,
      };
    case 'combobox':
      return {
        ...baseAttributes,
        role: 'combobox',
        'aria-haspopup': 'listbox',
        'aria-expanded': props.expanded || false,
      };
    case 'dialog':
      return {
        ...baseAttributes,
        role: 'dialog',
        'aria-modal': true,
      };
    case 'alert':
      return {
        ...baseAttributes,
        role: 'alert',
        'aria-live': 'assertive',
      };
    case 'status':
      return {
        ...baseAttributes,
        role: 'status',
        'aria-live': 'polite',
      };
    default:
      return baseAttributes;
  }
};

// Color contrast utility
export const getContrastRatio = (color1: string, color2: string): number => {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

// Accessibility hook for form validation
export const useAccessibleForm = () => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [announcements, setAnnouncements] = useState<string[]>([]);

  const addError = useCallback((fieldId: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldId]: [...(prev[fieldId] || []), message]
    }));
    setAnnouncements(prev => [...prev, message]);
  }, []);

  const clearErrors = useCallback((fieldId?: string) => {
    if (fieldId) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    } else {
      setErrors({});
    }
  }, []);

  const getFieldAttributes = useCallback((fieldId: string) => {
    const fieldErrors = errors[fieldId] || [];
    const hasError = fieldErrors.length > 0;
    const errorId = `${fieldId}-error`;

    return {
      'aria-invalid': hasError,
      'aria-describedby': hasError ? errorId : undefined,
      'aria-required': true,
    };
  }, [errors]);

  return {
    errors,
    announcements,
    addError,
    clearErrors,
    getFieldAttributes,
  };
};

// Accessibility hook for loading states
export const useAccessibleLoading = (isLoading: boolean, loadingText: string = 'Loading...') => {
  const [announcement, setAnnouncement] = useState<string>('');

  useEffect(() => {
    if (isLoading) {
      setAnnouncement(loadingText);
    } else {
      setAnnouncement('');
    }
  }, [isLoading, loadingText]);

  return {
    announcement,
    loadingAttributes: {
      'aria-busy': isLoading,
      'aria-live': isLoading ? 'polite' : 'off',
    },
  };
};

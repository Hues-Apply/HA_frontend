import React from 'react';

// Performance optimization utilities

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoization utility
export const memoize = <T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Lazy loading utility
export const lazyLoad = <T>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: T
): (() => Promise<T>) => {
  let cached: T | null = null;

  return async (): Promise<T> => {
    if (cached) return cached;

    try {
      const module = await importFunc();
      cached = module.default;
      return cached;
    } catch (error) {
      console.error('Failed to lazy load module:', error);
      if (fallback) return fallback;
      throw error;
    }
  };
};

// Intersection Observer utility for lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
};

// Virtual scrolling utility
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  totalItems: number;
  overscan?: number;
}

export interface VirtualScrollResult {
  startIndex: number;
  endIndex: number;
  visibleItems: number[];
  totalHeight: number;
  offsetY: number;
}

export const calculateVirtualScroll = (
  scrollTop: number,
  options: VirtualScrollOptions
): VirtualScrollResult => {
  const { itemHeight, containerHeight, totalItems, overscan = 5 } = options;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = Array.from(
    { length: endIndex - startIndex + 1 },
    (_, i) => startIndex + i
  );

  return {
    startIndex,
    endIndex,
    visibleItems,
    totalHeight: totalItems * itemHeight,
    offsetY: startIndex * itemHeight
  };
};

// Image lazy loading utility
export const lazyLoadImage = (
  img: HTMLImageElement,
  src: string,
  placeholder?: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (placeholder) {
      img.src = placeholder;
    }

    const imageLoader = new Image();

    imageLoader.onload = () => {
      img.src = src;
      resolve();
    };

    imageLoader.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };

    imageLoader.src = src;
  });
};

// Bundle size optimization utility
export const preloadResource = (href: string, as: string): void => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Memory management utility
export class MemoryManager {
  private cache = new Map<string, any>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  set(key: string, value: any): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Performance monitoring utility
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startTimer(name: string): () => void {
    const start = performance.now();
    return () => this.endTimer(name, start);
  }

  private endTimer(name: string, start: number): void {
    const duration = performance.now() - start;
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);
  }

  getAverageTime(name: string): number {
    const times = this.metrics.get(name);
    if (!times || times.length === 0) return 0;
    return times.reduce((a, b) => a + b, 0) / times.length;
  }

  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [name] of this.metrics) {
      result[name] = this.getAverageTime(name);
    }
    return result;
  }

  clear(): void {
    this.metrics.clear();
  }
}

// React performance utilities
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useThrottle = <T>(value: T, limit: number): T => {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastRan = React.useRef<number>(Date.now());

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};

// Export all performance utilities
export default {
  debounce,
  throttle,
  memoize,
  lazyLoad,
  createIntersectionObserver,
  calculateVirtualScroll,
  lazyLoadImage,
  preloadResource,
  MemoryManager,
  PerformanceMonitor,
  useDebounce,
  useThrottle
};

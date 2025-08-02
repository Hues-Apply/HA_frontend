// TypeScript utility functions for strict type handling

/**
 * Safely assigns an optional property, filtering out undefined values
 */
export function assignOptional<T extends Record<string, any>>(
  obj: T,
  key: keyof T,
  value: T[keyof T] | undefined
): T {
  if (value !== undefined) {
    return { ...obj, [key]: value };
  }
  return obj;
}

/**
 * Creates an object with optional properties, excluding undefined values
 */
export function createOptionalObject<T extends Record<string, any>>(
  obj: { [K in keyof T]: T[K] | undefined }
): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      (result as any)[key] = value;
    }
  }
  return result;
}

/**
 * Type guard to check if array index exists
 */
export function hasIndex<T>(array: T[], index: number): array is T[] & { [K in typeof index]: T } {
  return index >= 0 && index < array.length;
}

/**
 * Safely access array element with bounds checking
 */
export function safeArrayAccess<T>(array: T[], index: number): T | undefined {
  return hasIndex(array, index) ? array[index] : undefined;
}

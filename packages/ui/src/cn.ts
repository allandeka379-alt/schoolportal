import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Class-name merger used by every component. Combines clsx's conditional
 * semantics with tailwind-merge's conflict resolution ("px-4 px-6" → "px-6").
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

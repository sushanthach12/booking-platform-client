import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SIZE_CONFIG = {
  sm: {
    box: "size-3.5",   // 14px
    icon: "size-2.5",  // 10px
  },
  md: {
    box: "size-4",     // 16px
    icon: "size-3",    // 12px
  },
  lg: {
    box: "size-5",     // 20px
    icon: "size-3.5",  // 14px
  },
  "icon-sm": {
    box: "size-4",     // 16px
    icon: "size-3",    // 12px
  },
  "icon-lg": {
    box: "size-6",     // 24px
    icon: "size-4",    // 16px
  },
} as const;

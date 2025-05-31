import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export any other utility functions from the utils folder
export * from './deployment-utils'
export * from './file-utils'
export * from './project-stats'

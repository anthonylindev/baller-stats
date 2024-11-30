import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const scrollToSection = (href: string) => {
  if (href.startsWith('#')) {
    const elem = document.getElementById(href.substring(1))
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
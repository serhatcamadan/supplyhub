import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, locale = 'tr'): string {
  if (locale === 'en') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(iso: string, locale = 'tr'): string {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((w) => w.length > 0)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

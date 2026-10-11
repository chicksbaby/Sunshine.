/**
 * Utility functions for resolving and ensuring resilient product image paths
 * across production static hosting (e.g. Vercel) and development environments.
 */

export const DEFAULT_FALLBACK_IMAGE = '/images/strawberry-keychain.jpg';

export function resolveProductImage(url?: string): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return DEFAULT_FALLBACK_IMAGE;
  }
  
  const trimmed = url.trim();
  
  // Convert any legacy or dev path to the public root /images/ path
  if (trimmed.startsWith('/src/assets/images/')) {
    return trimmed.replace('/src/assets/images/', '/images/');
  }

  // If already relative to public /images/ or absolute URL or data URL
  if (trimmed.startsWith('/images/') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // If provided as a bare filename (e.g. "strawberry-keychain.jpg")
  if (!trimmed.startsWith('/')) {
    return `/images/${trimmed}`;
  }

  return trimmed;
}

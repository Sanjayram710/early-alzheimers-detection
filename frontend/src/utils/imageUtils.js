/**
 * Formats image source inputs (web URLs, relative paths, local Windows disk paths, or base64 data)
 * into a valid URL that the browser can display via the backend static uploads mount.
 */
export const formatImageUrl = (img) => {
  if (!img || typeof img !== 'string') return null;
  const trimmed = img.trim();
  if (!trimmed) return null;

  // 1. Data URLs or Absolute HTTP/HTTPS URLs
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed;
  }

  // 2. Local disk path or relative path containing 'uploads'
  const uploadsIdx = trimmed.search(/uploads[/\\]/i);
  if (uploadsIdx !== -1) {
    const cleanPath = trimmed.substring(uploadsIdx).replace(/\\/g, '/');
    return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  }

  // 3. Already starting with /
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // 4. Raw base64 string fallback
  return `data:image/png;base64,${trimmed}`;
};

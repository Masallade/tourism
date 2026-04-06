/**
 * Strip rich-text editor metadata (data-start, data-end, etc.) and remove script tags.
 * Use for displaying stored HTML from editors (e.g. React Quill) safely.
 */
export function sanitizeDescriptionHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/\s*data-[a-z-]+="[^"]*"/gi, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

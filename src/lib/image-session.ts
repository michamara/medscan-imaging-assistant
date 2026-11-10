/**
 * In-memory only: local preview URLs for images uploaded during this browser tab.
 * Nothing here is persisted or sent anywhere; refreshing the page clears it.
 */
const previews = new Map<string, string>();

export function rememberPreview(sessionId: string, objectUrl: string) {
  previews.set(sessionId, objectUrl);
}

export function getPreview(sessionId: string): string | undefined {
  return previews.get(sessionId);
}

export function forgetPreview(sessionId: string) {
  const url = previews.get(sessionId);
  if (url) URL.revokeObjectURL(url);
  previews.delete(sessionId);
}

export function forgetAllPreviews() {
  for (const id of [...previews.keys()]) forgetPreview(id);
}

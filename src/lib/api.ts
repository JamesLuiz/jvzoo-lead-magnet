/** Base URL for the API (empty = same origin, e.g. Vite dev proxy). */
export function getApiBase(): string {
  return import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";
}

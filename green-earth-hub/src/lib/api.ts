/** Backend API base URL. Use VITE_API_URL in .env to override (e.g. in production). */
export const API_BASE =
  (import.meta.env.VITE_API_URL as string) || 'http://localhost:5001';
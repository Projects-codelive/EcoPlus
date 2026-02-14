export const API_BASE = import.meta.env.VITE_API_URL === undefined
  ? 'http://localhost:5001'
  : import.meta.env.VITE_API_URL;
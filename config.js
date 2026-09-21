// In production the API is served from /api of this same site, so the
// storefront and the panel work without knowing their own domain. While
// developing, the API runs as a separate Node server on port 3000.
const LOCAL_HOSTS = ['localhost', '127.0.0.1', ''];

const API_BASE = LOCAL_HOSTS.includes(window.location.hostname)
  ? 'http://localhost:3000/api'
  : '/api';

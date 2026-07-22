// Lightweight replacement for react-router's location.state — persists a small
// payload across a client-side navigation using sessionStorage.
export function setNavState(key, value) {
  try { sessionStorage.setItem(`nav:${key}`, JSON.stringify(value)); } catch { /* ignore */ }
}
export function getNavState(key) {
  try {
    const v = sessionStorage.getItem(`nav:${key}`);
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}

// The web build (used for local testing) has no keychain, so it falls back to localStorage.
function safe<T>(fn: () => T, fallback: T) {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export const storage = {
  get: async (key: string) => safe(() => localStorage.getItem(key), null),
  set: async (key: string, value: string) => safe(() => localStorage.setItem(key, value), undefined),
  remove: async (key: string) => safe(() => localStorage.removeItem(key), undefined),
};

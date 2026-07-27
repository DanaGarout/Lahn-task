// Global Vitest setup — runs once before the test suite.
// jsdom doesn't implement matchMedia, but the theme store calls it to detect
// the OS-level dark mode preference, so we provide a minimal stub.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

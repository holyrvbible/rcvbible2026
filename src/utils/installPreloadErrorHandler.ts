const RELOAD_KEY = "vite:preloadError-reload";

/** Reload once when a lazy-loaded chunk is missing after a deploy. */
export function installPreloadErrorHandler(): void {
  window.addEventListener("load", () => {
    sessionStorage.removeItem(RELOAD_KEY);
  });

  window.addEventListener("vite:preloadError", (event) => {
    if (sessionStorage.getItem(RELOAD_KEY)) {
      return;
    }

    sessionStorage.setItem(RELOAD_KEY, "1");
    event.preventDefault();
    window.location.reload();
  });
}

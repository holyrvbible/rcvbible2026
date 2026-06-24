export function scrollToTop() {
  // The layout has a top bar which is always visible, so we need to scroll
  // to the top of the <main> tag, and not to the body top (which is always
  // visible).
  document.getElementsByTagName("main")[0].scrollTop = 0;
}

export function smoothScrollToElement(id: string) {
  const element = document.getElementById(id);

  element?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function jumpToElement(
  id: string,
  glowOnce?: (id: string) => void,
): void {
  function tryJump(): boolean {
    // Try going to outlines first.
    let element = document.getElementById(id + "-Outlines");
    if (element) {
      // A slight delay (e.g., 100ms) can help in more complex scenarios
      // where sub-components are still rendering.
      setTimeout(() => {
        element?.scrollIntoView({ block: "start" });
        glowOnce?.(id);
      }, 100);
      return true;
    }

    element = document.getElementById(id);
    if (element) {
      // A slight delay (e.g., 100ms) can help in more complex scenarios
      // where sub-components are still rendering.
      setTimeout(() => {
        element.scrollIntoView({ block: "start" });
        glowOnce?.(id);
      }, 100);
      return true;
    }

    return false;
  }

  if (tryJump()) return;

  // Try again later just in case.
  setTimeout(() => tryJump(), 500);
}

import { useCallback } from "react";

export function useGlowOnce() {
  const glowOnce = useCallback((elementId: string, duration = 2000) => {
    let element = document.getElementById(elementId);
    if (!element) return;

    // Allow elements to point to their real target elements.
    const aliasForId = element.getAttribute("data-aliasForId");
    if (aliasForId) {
      const e = document.getElementById(aliasForId);
      if (e) element = e;
    }

    const oldBgColor =
      element.style.backgroundColor ||
      getComputedStyle(element).backgroundColor;

    const keyframes = [
      { backgroundColor: oldBgColor, filter: "brightness(1)" },
      { backgroundColor: "#ffd700", filter: "brightness(1.3)" },
      { backgroundColor: "#ffaa00", filter: "brightness(1.6)" },
      { backgroundColor: "#ffd700", filter: "brightness(1.3)" },
      { backgroundColor: oldBgColor, filter: "brightness(1)" },
    ];

    const animation = element.animate(keyframes, {
      duration,
      easing: "ease-out",
      fill: "forwards",
    });

    animation.onfinish = () => {
      element.style.backgroundColor = oldBgColor;
    };
  }, []);

  return glowOnce;
}

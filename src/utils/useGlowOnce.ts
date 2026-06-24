import { useCallback } from "react";

export function useGlowOnce() {
  const glowOnce = useCallback(
    (elementId: string, duration = 2000) => {
      const element = document.getElementById(elementId);
      if (!element) return;

      const oldBgColor = element.style.backgroundColor;

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
    },
    [],
  );

  return glowOnce;
}

import { useMediaQuery } from "@mantine/hooks";
import type { ReactNode } from "react";

export function useIsMobile() {
  return useMediaQuery(`(max-width: 499px`);
}

/** Use the css class name selector instead of this whenever possible. */
export const MobileOrDesktop: React.FC<{
  mobile: ReactNode;
  desktop: ReactNode;
}> = ({ mobile, desktop }) => {
  return useIsMobile() ? mobile : desktop;
};

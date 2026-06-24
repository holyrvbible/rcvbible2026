import { Tooltip, type TooltipProps } from "@mantine/core";

export const SmoothTooltip: React.FC<TooltipProps> = (props) => {
  return (
    <Tooltip
      // 1. Use the 'slide-up' transition so it physically moves vertically
      transitionProps={{
        duration: 350, // 2. Bump up the duration (default is usually 100-200ms)
        timingFunction: "ease-out", // 3. Use ease-out for a snappier start and a soft deceleration
      }}
      {...props}
    />
  );
};

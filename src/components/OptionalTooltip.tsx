import { type TooltipProps } from "@mantine/core";
import { SmoothTooltip } from "./SmoothTooltip";

export const OptionalTooltip: React.FC<TooltipProps> = (props) => {
  return props.label ? <SmoothTooltip {...props} /> : props.children;
};

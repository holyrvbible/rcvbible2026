import { Tooltip, type TooltipProps } from "@mantine/core";

export const OptionalTooltip: React.FC<TooltipProps> = (props) => {
  return props.label ? <Tooltip {...props} /> : props.children;
};

import styles from "./LinkButton.module.css";
import clsx from "clsx";
import { Link as RouterLink } from "react-router";

export type LinkButtonVariant = "transparent" | "green";

export const LinkButton: React.FC<
  Parameters<typeof RouterLink>[0] & { variant?: LinkButtonVariant }
> = ({ variant = "transparent", className, ...restOfArgs }) => {
  return (
    <RouterLink
      className={clsx(styles.button, styles[variant], className)}
      viewTransition
      {...restOfArgs}
    />
  );
};

/** Use this for hash references. */
export const AnchorButton: React.FC<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > & { variant?: LinkButtonVariant }
> = ({ variant = "transparent", className, ...restOfArgs }) => {
  return (
    <a
      className={clsx(styles.button, styles[variant], className)}
      {...restOfArgs}
    />
  );
};

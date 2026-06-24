import clsx from "clsx";
import styles from "./FadeLine.module.css";

export const FadeLine: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, ...restOfProps }) => {
  return <div className={clsx(styles.fadeLine, className)} {...restOfProps} />;
};

export const VerticalFadeLine: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, ...restOfProps }) => {
  return (
    <div
      className={clsx(styles.verticalFadeLine, className)}
      {...restOfProps}
    />
  );
};

import styles from "./PageSpinner.module.css";

export const PageSpinner: React.FC = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
    </div>
  );
};

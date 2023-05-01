import styles from "./loading-dots.module.css";

type LoadingDotsProps = {
  color?: string;
  style?: string;
};
const LoadingDots = ({ color = "#FFFFFF", style = "medium" }: LoadingDotsProps) => {
  return (
    <span className={style == "small" ? styles.loading2 : styles.loading}>
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
    </span>
  );
};

export { LoadingDots };

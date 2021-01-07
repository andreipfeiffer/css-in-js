import styles from "./button.module.css";

type Props = {
  children: string;
  color?: string;
};

export function Button(props: Props) {
  const { children, color = "dodgerblue" } = props;

  return (
    <button className={styles.button} style={{ color }}>
      <span>{children}</span>
    </button>
  );
}

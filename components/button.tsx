import styles from "./button.module.css";

enum Color {
  grey = "#cccccc",
  blue = "dodgerblue",
  yellow = "#e3b307",
  green = "#57b004",
  red = "#db2e02",
}

type Props = {
  children: string;
  color?: keyof typeof Color;
  onClick?(): void;
};

export function Button(props: Props) {
  const { children, color = "grey", onClick } = props;

  return (
    <button
      className={styles.button}
      style={{ color: Color[color] }}
      onClick={onClick}
    >
      <span>{children}</span>
    </button>
  );
}

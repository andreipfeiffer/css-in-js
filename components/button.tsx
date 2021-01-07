import styles from "./button.module.css";

enum Color {
  blue = "dodgerblue",
  yellow = "#e3b307",
  green = "#57b004",
}

type Props = {
  children: string;
  color?: keyof typeof Color;
};

export function Button(props: Props) {
  const { children, color = "blue" } = props;

  return (
    <button className={styles.button} style={{ color: Color[color] }}>
      <span>{children}</span>
    </button>
  );
}

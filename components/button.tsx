import * as styles from "./button.treat";
import { ColorVariants } from "./button.types";

type Props = {
  children: string;
  color?: ColorVariants;
  onClick?(): void;
};

export function Button(props: Props) {
  const { children, color = "grey", onClick } = props;

  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${styles.button_variants[color]}`}
    >
      <span className={`${styles.button_text}`}>{children}</span>
    </button>
  );
}

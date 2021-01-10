import * as styles from "./input.treat";

type Props = {
  value: number;
  onChange(value: number): void;
};

export function Input({ value, onChange }: Props) {
  return (
    <>
      <label>
        User input styles:{" "}
        <input
          className={styles.input}
          // dynamic styling based on props is not supported
          style={{
            width: `${value}px`,
          }}
          type="number"
          value={value}
          onChange={(e) => onChange(+e.target.value)}
        />
      </label>
    </>
  );
}

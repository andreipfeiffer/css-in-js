import style9 from "style9";

type Props = {
  value: number;
  onChange(value: number): void;
};

export function Input({ value, onChange }: Props) {
  return (
    <label>
      User input styles:{" "}
      <input
        className={styles("input")}
        style={{ width: `${value}px` }}
        type="number"
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
    </label>
  );
}

const styles = style9.create({
  input: {
    padding: "0.5em",
  },
});

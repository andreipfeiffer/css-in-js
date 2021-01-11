import { style } from "typestyle";

type Props = {
  value: number;
  onChange(value: number): void;
};

export function Input({ value, onChange }: Props) {
  const className = getStyles(value);

  return (
    <>
      <label>
        User input styles:{" "}
        <input
          className={className}
          type="number"
          value={value}
          onChange={(e) => onChange(+e.target.value)}
        />
      </label>
    </>
  );
}

function getStyles(width: number) {
  return style({
    padding: "0.5em",
    width: `${width}px`,
  });
}

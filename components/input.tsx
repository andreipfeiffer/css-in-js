import { css } from "goober";

type Props = {
  value: number;
  onChange(value: number): void;
};

export function Input({ value, onChange }: Props) {
  // we can also use className instead of styled components
  return (
    <>
      <label>
        User input styles:{" "}
        <input
          className={css({
            padding: "0.5em",
            width: `${value}px`,
          })}
          type="number"
          value={value}
          onChange={(e) => onChange(+e.target.value)}
        />
      </label>
    </>
  );
}

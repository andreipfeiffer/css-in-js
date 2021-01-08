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
          style={{
            width: `${value}px`,

            // this can be moved as a static style, in the .css file
            padding: "0.5em",
          }}
          type="number"
          value={value}
          onChange={(e) => onChange(+e.target.value)}
        />
      </label>
    </>
  );
}

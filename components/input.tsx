import css from "styled-jsx/css";

type Props = {
  value: number;
  onChange(value: number): void;
};

export function Input({ value, onChange }: Props) {
  const { className, styles } = getStyles(value);

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

      {/* we need to add the styles manually here, otherwise, they will not be applied */}
      {/* NOTE: this is an object, not a string, as the type say  */}
      {styles}
    </>
  );
}

function getStyles(width: number) {
  return css.resolve`
    input {
      padding: 0.5em;
      width: ${width}px;
    }
  `;
}

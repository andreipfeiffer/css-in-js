import { FelaStyle, useFela } from "react-fela";

type Props = {
  value: number;
  onChange(value: number): void;
};

export function Input(props: Props) {
  const { value, onChange } = props;
  const { css } = useFela(props);

  return (
    <>
      <label>
        User input styles:{" "}
        <input
          className={css(inputStyle)}
          type="number"
          value={value}
          onChange={(e) => onChange(+e.target.value)}
        />
      </label>
    </>
  );
}

// styles can also be declared as a rule
// rule typings are a bit convoluted
const inputStyle: FelaStyle<{}, Props> = (props) => ({
  padding: "0.5em",
  width: `${props.value}px`,
});

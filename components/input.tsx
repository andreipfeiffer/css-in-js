import { createUseStyles } from "react-jss";

type Props = {
  value: number;
  onChange(value: number): void;
};

export function Input(props: Props) {
  const { value, onChange } = props;
  const classes = useStyles(props);

  return (
    <>
      <label>
        User input styles:{" "}
        <input
          className={classes.input}
          type="number"
          value={value}
          onChange={(e) => onChange(+e.target.value)}
        />
      </label>
    </>
  );
}

const useStyles = createUseStyles({
  input: {
    padding: "0.5em",
    width: (props: Props) => `${props.value}px`,
  },
});

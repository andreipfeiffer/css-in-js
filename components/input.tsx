import styled from "@emotion/styled";

type Props = {
  value: number;
  onChange(value: number): void;
};

export function Input({ value, onChange }: Props) {
  return (
    <>
      <label>
        User input styles:{" "}
        <StyledInput
          type="number"
          value={value}
          // this one is tricky, because we don't render the `input` element anymore
          // we render the `StyledInput` component, which is typed with Props
          // so our definition of `onChange` overrides the `input` definition
          // if we type it as `React.ChangeEvent<HTMLInputElement>` we will get type conflicts
          onChange={(e: any) => onChange(+e.target.value)}
        />
      </label>
    </>
  );
}

const StyledInput = styled.input<Props>(
  {
    padding: "0.5em",
  },
  (props) => ({
    width: `${props.value}px`,
  })
);

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
          onChange={(e: any) => onChange(+e.target.value)}
        />
      </label>
    </>
  );
}

const StyledInput = styled("input")<Props>(
  {
    padding: "0.5em",
  },
  (props) => ({
    width: `${props.value}px`,
  })
);

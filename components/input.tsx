import styled from "@emotion/styled";

type Props = {
  value: number;
  onChange(value: number): void;
  className?: string;
};

function InputUnstyled({ value, onChange, className }: Props) {
  return (
    <>
      <label>
        User input styles:{" "}
        <input
          // if we pass additional className, they will be prepended
          className={className}
          type="number"
          value={value}
          onChange={(e) => onChange(+e.target.value)}
        />
      </label>
    </>
  );
}

export const Input = styled(InputUnstyled)<Props>(
  {
    padding: "0.5em",
  },
  (props) => ({
    width: `${props.value}px`,
  })
);

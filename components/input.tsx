import styled from "styled-components";

type Props = {
  value: number;
  onChange(value: number): void;
};

export function Input({ value, onChange }: Props) {
  return (
    <>
      <label>
        User input styles:{" "}
        <UserInput
          type="number"
          value={value}
          onChange={(e) => onChange(+e.target.value)}
        />
      </label>
    </>
  );
}

// can use tagged templates
const UserInput = styled.input`
  padding: 0.5em;
  width: ${(props) => props.value}px;
`;

import React from "react";
import { css } from "../stitches.config";

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
          className={css({
            width: `${value}px`,
            padding: "0.5em",
          })}
          type="number"
          value={value}
          onChange={(e) => onChange(+e.target.value)}
        />
      </label>
    </>
  );
}

import React from "react";
import { css } from "../stitches.config";

type Props = {
  value: number;
  onChange(value: number): void;
};

export function Input({ value, onChange }: Props) {
  const styles = css({
    width: `${value}px`,
  });

  return (
    <>
      <label>
        User input styles:{" "}
        <input
          className={`${inputStaticStyles} ${styles}`}
          type="number"
          value={value}
          onChange={(e) => onChange(+e.target.value)}
        />
      </label>
    </>
  );
}

const inputStaticStyles = css({
  padding: "0.5em",
});

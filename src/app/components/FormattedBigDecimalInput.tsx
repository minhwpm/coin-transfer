"use client";

import { NumericFormat } from "react-number-format";
import { useState } from "react";

export const FormattedBigDecimalInput = ({ name }: { name: string }) => {
  const [value, setValue] = useState<string>("");

  return (
    <NumericFormat
      value={value}
      onValueChange={(values) => {
        setValue(values.value); // raw value without commas
        console.log("Clean value:", values.value); // e.g., "22222222.3333333333"
      }}
      thousandSeparator=","
      decimalScale={10} // max 10 decimals
      allowNegative={false}
      inputMode="decimal"
      placeholder="0.00"
      className="outline-none text-end text-lg font-semibold rounded-full h-10 sm:h-12 px-4"
      name={name}
    />
  );
};

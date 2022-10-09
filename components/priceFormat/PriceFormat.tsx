import React from "react";
import { getCurrentcyFormat } from "../../utils/getCurrencyFormat";

type Props = {
  currency: string;
  amount: number;
};

export default function PriceFormat({ currency, amount }: Props) {
  return (
    <>
      {getCurrentcyFormat({
        currency: currency,
        amount: amount,
      })}
      {/* &nbsp;{currency === "DZ" ? "DZD" : null} */}
    </>
  );
}

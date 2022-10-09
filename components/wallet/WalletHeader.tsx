import React from "react";
import Moment from "react-moment";
import { globalState } from "../../features/globalSlice";
import useExchange from "../../hooks/useExchange";
import { useAppSelector } from "../../hooks/useReduxHook";
import useWallet from "../../hooks/useWallet";
import H1 from "../common/heading/H1";
import PriceFormat from "../priceFormat/PriceFormat";

type Props = {
  wallet: number;
  exchange: any;
};

export default function WalletHeader({ wallet, exchange }: Props) {
  return (
    <div>
      <H1 className="text-3xl">
        <span style={{ fontWeight: "bold" }}>Wallet </span>
      </H1>
      <span style={{ fontSize: "38px", fontWeight: "bold" }}>
        <PriceFormat currency="EUR" amount={0 || wallet} />
      </span>
      <div style={{ fontWeight: "bold" }}>
        <PriceFormat
          currency="DZD"
          amount={(wallet || 0) * Number(exchange?.amount)}
        />
        &nbsp;| <PriceFormat currency="EUR" amount={1} />
        &nbsp;={" "}
        <PriceFormat currency="DZD" amount={Number(exchange?.amount || 0)} />
        &nbsp;
      </div>
      <div>
        Exchange rate of&nbsp;
        <Moment format="DD/MM/yyyy">{exchange?.createdAt}</Moment>
      </div>
    </div>
  );
}

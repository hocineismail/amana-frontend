import React, { useEffect } from "react";
import Button from "../common/button/Button";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

import { db } from "../../firebase/firebase";
import H1 from "../common/heading/H1";
import Charge from "../transfers/Charge";
// import useFirebaseAuth from "../../hooks/useFirebaseAuth";
// import useWallet from "../../hooks/useWallet";
import useExchange from "../../hooks/useExchange";
import Moment from "react-moment";
import { getReference } from "../../utils/getReference";
import { getCurrentcyFormat } from "../../utils/getCurrencyFormat";
import Transfer from "../transfers/Transfer";
import PriceFormat from "../priceFormat/PriceFormat";
import useWallet from "../../hooks/useWallet";
import WalletHeader from "./WalletHeader";
import WalletActions from "./WalletActions";
import { useAppSelector } from "../../hooks/useReduxHook";
import { globalState } from "../../features/globalSlice";
interface Props {
  amount: number;
  amountBlocked: number;
}
export default function Wallet({ amount, amountBlocked }: Props) {
  const { exchange } = useAppSelector(globalState);
  if (!exchange?.amount)
    return (
      <div className="bg-blue text-center text-white pt-14 pb-14">
        <div style={{ maxWidth: "200px", margin: "auto", height: "80px" }}>
          <div className="load-wraper-wallet">
            <div className="activity-wallet"></div>
          </div>
        </div>

        <div style={{ maxWidth: "260px", margin: "10px auto", height: "30px" }}>
          <div className="load-wraper-wallet">
            <div className="activity-wallet"></div>
          </div>
        </div>

        <div style={{ maxWidth: "220px", margin: "10px auto", height: "30px" }}>
          <div className="load-wraper-wallet">
            <div className="activity-wallet"></div>
          </div>
        </div>

        <div
          style={{
            maxWidth: "300px",
            margin: "10px auto",
            height: "30px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            marginTop: "30px",
            gridGap: "50px",
          }}
        >
          <div className="load-wraper-wallet">
            <div className="activity-wallet"></div>
          </div>
          <div className="load-wraper-wallet">
            <div className="activity-wallet"></div>
          </div>
        </div>
      </div>
    );
  return (
    <div className="bg-blue text-center text-white pt-14 pb-14">
      <WalletHeader wallet={amount} exchange={exchange} />
      <WalletActions amountBlocked={amountBlocked} wallet={amount} />
    </div>
  );
}

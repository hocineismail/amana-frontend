import React from "react";
import { transferSwitchState } from "../../features/transferSwitch";
import { useAppSelector } from "../../hooks/useReduxHook";
import SidebarDetails from "../sidebar/SidebarDetails";
import AllTransactions from "./AllTransactions";
import ChargerWallet from "./ChargerWallet";
import Transfers from "./Transfers";

type Props = {
  amountBlocked: number;
};

export default function Transactions({ amountBlocked }: Props) {
  const { sent, added, all } = useAppSelector(transferSwitchState);
  if (!sent && !added && !all) return <div>loading...</div>;

  return (
    <>
      {all ? (
        <AllTransactions amountBlocked={amountBlocked} />
      ) : added ? (
        <ChargerWallet amountBlocked={amountBlocked} />
      ) : (
        <Transfers amountBlocked={amountBlocked} />
      )}
      <SidebarDetails />
      ``
    </>
  );
}

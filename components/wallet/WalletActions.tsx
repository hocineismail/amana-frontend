import React from "react";
import Charge from "../transfers/Charge";
import Transfer from "../transfers/Transfer";

type Props = {
  amountBlocked: number;
  wallet: number;
};

export default function WalletActions({ amountBlocked, wallet }: Props) {
  const [chargeDisplay, setChargeDisplay] = React.useState(false);
  const [TransferDisplay, setTransferDisplay] = React.useState(false);

  const onChargeAccount = () => {
    setTransferDisplay(false);
    setChargeDisplay(true);
  };
  const onTranferMoeny = () => {
    setChargeDisplay(false);
    setTransferDisplay(true);
  };
  const [loading, setLoading] = React.useState(false);
  const isLoading = (value: boolean) => {
    setLoading(value);
  };
  return (
    <div>
      {loading ? <div className="loading">Loading&#8230;</div> : null}
      <button
        style={{ width: "130px" }}
        data-testid="charge-wallet"
        className="ml-4 mr-4 mt-10 mb-10  box-shadow pt-2 pb-2 pl-4 pr-4  max-w-sm bg-semi rounded-2xl   shadow-2xl dark:bg-semi"
        onClick={() => onChargeAccount()}
      >
        Deposit
      </button>
      <button
        style={{ width: "130px" }}
        data-testid="transfer-wallet"
        className="ml-4 mr-4 mt-10 mb-10   box-shadow   pt-2 pb-2 pl-4 pr-4  max-w-sm bg-semi rounded-2xl   shadow-2xl dark:bg-semi"
        onClick={() => onTranferMoeny()}
      >
        Send
      </button>
      <div
        className={chargeDisplay || TransferDisplay ? `modal-background` : ""}
      >
        {chargeDisplay ? (
          <Charge onCloseModel={(e) => setChargeDisplay(e)} />
        ) : null}{" "}
        {TransferDisplay ? (
          <Transfer
            wallet={wallet}
            onCloseModel={(e) => setTransferDisplay(e)}
            isLoading={(status) => isLoading(status)}
            amountBlocked={amountBlocked}
          />
        ) : null}
      </div>
    </div>
  );
}

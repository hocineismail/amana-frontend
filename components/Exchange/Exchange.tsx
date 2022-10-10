import React, { useEffect } from "react";
import Link from "next/link";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import CurrencyInput from "react-currency-input-field";
import { db } from "../../firebase/firebase";
import Button from "../common/button/Button";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxHook";
import { globalState } from "../../features/globalSlice";
import { onGetExchange } from "../../actions/actions";
import { getCurrentcyFormat } from "../../utils/getCurrencyFormat";

interface IMoney {
  moneyEuro: number;
  moneyDinar: number;
}
export default function Exchange() {
  const [Exchange, setExchange] = React.useState<IMoney>({
    moneyEuro: 1,
    moneyDinar: 1,
  });

  const { exchange } = useAppSelector(globalState);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(onGetExchange());
  }, [dispatch]);
  /* function to get exchange price from firestore in realtime */
  useEffect(() => {
    if (exchange?.amount) {
      setExchange((prevState) => ({
        ...prevState,
        moneyDinar: prevState.moneyEuro * exchange.amount,
      }));
    }
  }, [exchange]);

  return (
    <div className="flex mx-auto flex-wrap justify-between ">
      <div
        role="cell"
        className="box-shadow mt-20 p-6   max-w-sm bg-semi rounded-2xl   shadow-2xl dark:bg-semi"
      >
        <h5 className="mb-2 text-2xl text-white font-sans font-bold tracking-tight text-gray-900 dark:text-white">
          Send Money
        </h5>

        <div className="mt-2 mb-2">
          <label className="font-bold text-white">You send </label>
          <CurrencyInput
            data-testid="TodoList"
            id="input-example"
            className="rounded-2xl mt-3   w-full h-12 text-bold text-pink-500"
            name="input-name"
            placeholder="Please enter a number"
            defaultValue={1.0}
            // fixedDecimalLength={2}
            prefix="€ "
            maxLength={1000}
            value={Exchange.moneyEuro.toFixed(2)}
            onValueChange={(value, name) => {
              if (value) {
                let newCurrencty =
                  Number(value) < 1000000 ? Number(value) : 1000000;
                setExchange({
                  moneyEuro: newCurrencty,
                  moneyDinar: newCurrencty * Number(exchange?.amount || 1),
                });
              } else {
                setExchange({
                  moneyEuro: Number(0),
                  moneyDinar: Number(0) * Number(exchange?.amount || 1),
                });
              }
            }}
            // onValueChange={(value, name) => console.log(value, name)}
          />

          {/* <label className="font-bold text-white">You are sending</label>
        <input
          type="number"
          className="rounded-2xl mt-3   w-full h-12  text-pink-500"
          value={Exchange.moneyEuro.toFixed(2)}
          onChange={(e) =>
            setExchange({
              moneyEuro: Number(e.target.value),
              moneyDinar: Number(e.target.value) * exchangePrice,
            })
          }
        /> */}
        </div>
        <div className="mt-2 mb-5">
          <p className="mb-3 font-sans  font-medium text-white dark:text-gray-400">
            Fees = €0,00
            <br />
            {!exchange
              ? "Loading..."
              : `  Ex-change rate today X € 1 = ${getCurrentcyFormat({
                  currency: "DZD",
                  amount: exchange?.amount,
                })}`}
          </p>
        </div>

        <div className="mt-2 mb-2">
          <label className="font-bold  text-white">Reciever gets</label>
          <CurrencyInput
            id="input-example"
            className="rounded-2xl mt-3   w-full h-12  text-pink-500"
            name="input-name"
            placeholder="Please enter a number"
            defaultValue={1}
            // groupSeparator=","
            // decimalSeparator="."

            // fixedDecimalLength={2}
            prefix="DZD  "
            value={Exchange.moneyDinar.toFixed(2)}
            onValueChange={(value, name) => {
              if (value) {
                let max = 1000000 * Number(exchange?.amount || 1);
                let currency = Number(value) < max ? Number(value) : max;
                setExchange({
                  moneyEuro: currency / Number(exchange?.amount || 1),
                  moneyDinar: currency,
                });
              } else {
                setExchange({
                  moneyEuro: Number(0) / Number(exchange?.amount || 1),
                  moneyDinar: Number(0),
                });
              }
            }}
          />
        </div>

        <Link href="/signup">
          <a>
            <Button
              dataTestid="signup"
              className="mt-5 pl-10 pr-10 w-full  fw-400 text-black bg-orange
              border border-orange  h-12
              justify-item 
              hover:bg-orange  focus:ring-4 
              focus:ring-orange-300 font-bold 
              rounded-2xl  text-base px-5 py-2.5
              text-center mr-2 mb-2 dark:bg-orange-600 
            dark:hover:bg-orange dark:focus:ring-orange-800
              font-sans"
            >
              Send Now
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
}

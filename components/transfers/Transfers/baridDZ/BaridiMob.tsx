import React from "react";
import CurrencyInput from "react-currency-input-field";
import validator from "validator";
//@ts-ignore
//import CurrencyFormat from "react-currency-format";
import {
  financial,
  getCurrentcyFormat,
} from "../../../../utils/getCurrencyFormat";
import { CgMathEqual } from "react-icons/cg";
import { RiSubtractFill } from "react-icons/ri";
import { FiX } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../../../hooks/useReduxHook";
import { globalState } from "../../../../features/globalSlice";
import { onGetFees } from "../../../../actions/actions";
import { isValidAmountTransferBARIDIMOB } from "../../../../helpers/validationAmount";
import PlaceholderTransaction from "../../../placeholder/PlaceholderTransaction";
type Props = {
  step: number;
  wallet: number;
  onGetForm: (form: any) => void;
};

export default function BaridiMob({ step, onGetForm, wallet }: Props) {
  const [errorsForm, setErrorsFrom] = React.useState({
    RIP: null,
    relation: null,
  });
  const [request, setRequest] = React.useState({
    method: "Baridi Mob",
    amount: 1,
    exchange: 0,
    total_fee: 1,
    address: "",
    RIP: "",
    phone: "",
    details: "",
    relation: "",
  });
  const [amount, setAmount] = React.useState({
    euro: 1,
    euroWithoutFees: 1,
    dinar: 1,
    dinarWithoutFees: 1,
  });
  // const { fees, loading } = useFees();

  const { exchange, fees, firstFetchFees } = useAppSelector(globalState);

  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (firstFetchFees) {
      dispatch(onGetFees());
    }
  }, [firstFetchFees]);

  React.useEffect(() => {
    if (exchange?.amount && !fees[0]?.preFees) {
      setRequest((prevState) => ({
        ...prevState,
        exchange: Number(exchange?.amount),
      }));
      onChangeDinar(1000);
    }
  }, [exchange, fees, setRequest]);
  const [error, setError] = React.useState<any>({
    error: false,
    msg: "",
  });
  const onChangeEuro = (value: number) => {
    let amountValue = value;
    let isValid = isValidAmountTransferBARIDIMOB({
      walletAmount: wallet * Number(exchange?.amount),
      currentAmount:
        (amountValue - Number(getFeeAmana(amountValue))) *
        Number(exchange?.amount),
      minAmount: 1000,
      maxAmount:
        (100000 - Number(getFeeAmana(100000))) * Number(exchange?.amount),
    });
    setError(isValid);
    onGetForm({
      ...request,
      isValid: isValid?.error,
      amount: amountValue,
      total_fee: Number(getFeeAmana(amountValue)),
    });

    setRequest({
      ...request,
      amount: amountValue,
      total_fee: financial(Number(getFeeAmana(amountValue))),
    });

    setAmount({
      euro: financial(amountValue - Number(getFeeAmana(amountValue))),
      euroWithoutFees: financial(amountValue),
      dinar: financial(
        (amountValue - Number(getFeeAmana(amountValue))) *
          Number(exchange?.amount)
      ),
      dinarWithoutFees: financial(amountValue * Number(exchange?.amount)),
    });
  };
  const onChangeDinar = (value: Number) => {
    let fees = setFeeAmana(Number(value) / Number(exchange?.amount));
    // if (Number(value) / Number(exchange?.amount) + Number(fees) >= wallet) {
    //   onChangeEuro(wallet);
    // } else {
    let isValid = isValidAmountTransferBARIDIMOB({
      walletAmount: wallet * Number(exchange?.amount),
      currentAmount: Number(value),
      maxAmount: 100000,
      minAmount: 1000,
    });

    setError(isValid);
    onGetForm({
      ...request,
      isValid: isValid.error,
      amount: Number(value) / Number(exchange?.amount) + Number(fees),
      total_fee: Number(fees),
    });
    setRequest({
      ...request,
      amount: financial(
        Number(value) / Number(exchange?.amount) + Number(fees)
      ),
      total_fee: financial(Number(fees)),
    });
    setAmount({
      euro: financial(Number(value) / Number(exchange?.amount)),
      euroWithoutFees: financial(
        Number(value) / Number(exchange?.amount) + Number(fees)
      ),
      dinar: financial(Number(value)),
      dinarWithoutFees: financial(Number(value)),
    });
    // }
  };

  function getFeeAmana(amount: number) {
    for (let i = 0; i < fees.length; i++) {
      if (
        amount >= fees[i].fees?.min_price &&
        amount <= fees[i].fees?.max_price
      ) {
        if (fees[i].fees.type === "fix") {
          return financial(Number(fees[i].fees.fee));
        } else {
          return financial((amount * Number(fees[i].fees.fee)) / 100);
        }
      }
    }
  }
  function setFeeAmana(amount: number) {
    let reversed = fees || [];
    for (let i = 0; i < reversed.length; i++) {
      let euroWithFees = amount + Number(reversed[i].fees.fee);
      if (
        euroWithFees >= reversed[i].fees.min_price &&
        euroWithFees <= reversed[i].fees.max_price
      ) {
        if (fees[i].fees.type === "fix") {
          return financial(Number(reversed[i].fees.fee));
        } else {
          return financial((amount * Number(reversed[i].fees.fee)) / 100);
        }
      }
    }
  }

  const onChangeForm = (e: any) => {
    setErrorsFrom({
      ...errorsForm,
      [e.target.name]: null,
    });
    if (e.target.name === "RIP") {
      setRequest({
        ...request,
        [e.target.name]: e.target.value.replace(/\D/g, ""),
      });
      onGetForm({
        ...request,
        [e.target.name]: e.target.value.replace(/\D/g, ""),
      });
    } else if (e.target.name === "relation" || e.target.name === "details") {
      setRequest({
        ...request,
        [e.target.name]: e.target.value.replace(/[^A-Za-z'0-9 -]+/gi, ""),
      });
      onGetForm({
        ...request,
        [e.target.name]: e.target.value.replace(/[^A-Za-z'0-9 -]+/gi, ""),
      });
    } else {
      setRequest({
        ...request,
        [e.target.name]: e.target.value.replace(/[^A-Za-z' -]+/gi, ""),
      });
      onGetForm({
        ...request,
        [e.target.name]: e.target.value.replace(/[^A-Za-z' -]+/gi, ""),
      });
    }
  };
  if (fees.length === 0 || fees[0]?.preFees)
    return (
      <div>
        <PlaceholderTransaction />
      </div>
    );
  return (
    <div>
      {step === 1 ? (
        <>
          <div
            style={{
              backgroundColor: "#FFDBB9",
              fontSize: "14px",
              fontWeight: "bold",
              borderRadius: "15px",
              marginTop: "10px",
              padding: "15px",
            }}
          >
            <p> We will transfer your money in the same day </p>
          </div>
          <div className="mt-2 mb-2">
            <label className="font-bold text-black">You send</label>
            <CurrencyInput
              value={Number(amount.euroWithoutFees).toFixed(2)}
              prefix={"€ "}
              allowDecimals={true}
              allowNegativeValue={false}
              className={`rounded-2xl mt-3${
                error.error ? " border-red focus:border-red border-2" : ""
              }  w-full h-12 text-bold text-pink-500`}
              onValueChange={(value: any) => {
                // formattedValue = $2,223
                // value ie, 2223
                onChangeEuro(value ? value : 0);
              }}
            />
          </div>
          <div style={{ position: "relative", height: "99px" }}>
            <div style={{ zIndex: 10, position: "absolute" }}>
              <ul>
                <li style={{ margin: "8px 20px" }}>
                  <div
                    style={{
                      display: "inline-block",
                      width: "25px",
                      height: "25px",
                      paddingLeft: "3px",
                      marginRight: "4px",
                      background: "#002b48",
                      borderRadius: "100%",
                      zIndex: 10,
                    }}
                  >
                    <RiSubtractFill
                      color="white"
                      style={{
                        marginBottom: "2px ",
                        marginLeft: "1px",
                        display: "inline-block",
                        zIndex: 10,
                      }}
                    />
                  </div>
                  {getCurrentcyFormat({
                    currency: "EUR",
                    amount: Number(getFeeAmana(amount.euroWithoutFees || 1)),
                  })}
                  &nbsp;fees
                </li>
                <li style={{ margin: "8px 20px" }}>
                  <div
                    style={{
                      display: "inline-block",
                      width: "25px",
                      height: "25px",
                      paddingLeft: "3px",
                      marginRight: "4px",
                      background: "#002b48",
                      borderRadius: "100%",
                    }}
                  >
                    <CgMathEqual
                      color="white"
                      style={{
                        display: "inline-block",
                        marginBottom: "3px ",
                        marginLeft: "2px",
                      }}
                    />
                  </div>
                  {getCurrentcyFormat({
                    currency: "EUR",
                    amount: amount.euro,
                  })}
                </li>
                <li style={{ margin: "8px 20px" }}>
                  <div
                    style={{
                      display: "inline-block",
                      width: "25px",
                      height: "25px",
                      paddingLeft: "3px",
                      marginRight: "4px",
                      background: "#002b48",
                      borderRadius: "100%",
                    }}
                  >
                    <FiX
                      color="white"
                      style={{
                        display: "inline-block",
                        marginBottom: "2px ",
                        marginLeft: "2px",
                      }}
                    />
                  </div>
                  {getCurrentcyFormat({
                    currency: "DZD",
                    amount: exchange?.amount,
                  })}
                </li>
              </ul>
            </div>
            <div
              style={{
                position: "absolute",
                top: 10,
                bottom: 0,
                width: "2px",
                backgroundColor: "gray",
                left: "32px",
                zIndex: 1,
              }}
            ></div>
          </div>
          <div className="mt-2 mb-2">
            <label className="font-bold text-black">Receiver gets</label>
            <CurrencyInput
              value={Number(amount.dinar).toFixed(2)}
              prefix={"DZD "}
              allowDecimals={true}
              allowNegativeValue={false}
              className={`rounded-2xl mt-3${
                error.error ? " border-red focus:border-red border-2" : ""
              }  w-full h-12 text-bold text-pink-500`}
              onValueChange={(value: any) => {
                // formattedValue = $2,223
                // value ie, 2223
                onChangeDinar(value ? value : 0);
              }}
            />{" "}
            {error.error ? (
              <span style={{ color: "red", fontSize: "12px" }}>
                {error?.msg}
              </span>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div>
            <div className="mt-2 mb-2  ">
              <label className="font-bold text-black"> RIP of receiver </label>
              <div
                style={{ display: "grid", gridTemplateColumns: "100px auto " }}
              >
                <div
                  style={{
                    display: "inline-block",

                    border: errorsForm.RIP ? "2px solid red" : "1px solid gray",
                    marginTop: "12px",
                    paddingTop: "12px",
                    paddingLeft: "12px",
                  }}
                  className="rounded-l-2xl bg-gray"
                >
                  0079999
                </div>
                <input
                  className={`rounded-r-2xl mt-3  ${
                    errorsForm.RIP
                      ? " border-red focus:border-red border-2"
                      : ""
                  } w-full h-12 text-bold text-pink-500`}
                  style={{ fontWeight: "bold" }}
                  name="RIP"
                  type="text"
                  pattern="\d{1,5}"
                  placeholder="RIP of receiver"
                  value={request.RIP}
                  inputMode="numeric"
                  maxLength={9}
                  minLength={9}
                  required
                  onBlur={(e) => {
                    onChangeForm(e);

                    if (
                      !validator.isLength(e.target.value, { min: 7, max: 14 })
                    ) {
                      setErrorsFrom({
                        ...errorsForm,
                        [e.target.name]: "RIP IS invalid",
                      });
                    }
                  }}
                  onChange={onChangeForm}
                />
                {errorsForm.RIP ? (
                  <span className="text-red text-xs">{errorsForm.RIP}</span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-2 mb-2">
            <label className="font-bold text-black">
              Your relation with the receiver
            </label>
            <textarea
              placeholder="Enter your relation with receiver"
              className={`rounded-2xl mt-3  
            ${
              errorsForm.relation ? " border-red focus:border-red border-2" : ""
            }        w-full  text-bold text-pink-500`}
              name="relation"
              value={request.relation}
              maxLength={100}
              onChange={onChangeForm}
              rows={3}
              cols={50}
              onBlur={(e) => {
                onChangeForm(e);
                if (!validator.isLength(e.target.value, { min: 2, max: 100 })) {
                  setErrorsFrom({
                    ...errorsForm,
                    [e.target.name]: "You have to write more",
                  });
                }
              }}
            ></textarea>
            {errorsForm.relation ? (
              <span className="text-red text-xs">{errorsForm.relation}</span>
            ) : (
              <span className="text-xs text-[#010101]">
                Characters left: {100 - request.relation.length}
              </span>
            )}
          </div>
          <div className="mt-2 mb-2">
            <label className="font-bold text-black">Notes</label>
            <textarea
              placeholder="Enter any notes you want to add here"
              className="rounded-2xl mt-3   w-full  text-bold text-pink-500"
              name="details"
              style={{ fontWeight: "bold" }}
              onChange={onChangeForm}
              rows={3}
              cols={50}
            ></textarea>
          </div>
        </>
      )}
    </div>
  );
}

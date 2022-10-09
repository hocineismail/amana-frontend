import React from "react";

//@ts-ignore
import CurrencyFormat from "react-currency-format";
import {
  financial,
  getCurrentcyFormat,
} from "../../../../utils/getCurrencyFormat";

import { CgMathEqual } from "react-icons/cg";
import { RiSubtractFill } from "react-icons/ri";
import { FiX } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../../../hooks/useReduxHook";
import { globalState } from "../../../../features/globalSlice";
import validator from "validator";
import { onGetFees } from "../../../../actions/actions";
import { isValidAmountTransferBARIDIMOB } from "../../../../helpers/validationAmount";
import PlaceholderTransaction from "../../../placeholder/PlaceholderTransaction";

type Props = {
  step: number;
  wallet: number;
  onGetForm: (form: any) => void;
};

export default function MoneyOrder({ step, onGetForm, wallet }: Props) {
  const [request, setRequest] = React.useState({
    firstname: "",
    lastname: "",
    method: "Mondat Algérie Poste",
    amount: 1,
    exchange: 0,
    total_fee: 1,
    address: "",
    relation: "",
    ccp: 23,
    key: "",
    phone: "",
    details: "",
    isValid: true,
  });
  const [amount, setAmount] = React.useState({
    euro: 1,
    euroWithoutFees: 1,
    dinar: 1,
    dinarWithoutFees: 1,
  });

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
        (200000 - Number(getFeeAmana(100000))) * Number(exchange?.amount),
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
      isValid: isValid?.error,
      total_fee: Number(getFeeAmana(amountValue)),
    });
    setAmount({
      euro: amountValue - Number(getFeeAmana(amountValue)),
      euroWithoutFees: amountValue,
      dinar:
        (amountValue - Number(getFeeAmana(amountValue))) *
        Number(exchange?.amount),
      dinarWithoutFees: amountValue * Number(exchange?.amount),
    });
  };

  const onChangeDinar = (value: Number) => {
    let fees = setFeeAmana(Number(value) / Number(exchange?.amount));
    let isValid = isValidAmountTransferBARIDIMOB({
      walletAmount: wallet * Number(exchange?.amount),
      currentAmount: Number(value),
      maxAmount: 200000,
      minAmount: 1000,
    });

    setError(isValid);
    onGetForm({
      ...request,
      isValid: isValid?.error,
      amount: Number(value) / Number(exchange?.amount) + Number(fees),
      total_fee: Number(fees),
    });
    setRequest({
      ...request,
      isValid: isValid?.error,
      amount: Number(value) / Number(exchange?.amount) + Number(fees),
      total_fee: Number(fees),
    });
    setAmount({
      euro: Number(value) / Number(exchange?.amount),
      euroWithoutFees: Number(value) / Number(exchange?.amount) + Number(fees),
      dinar: Number(value),
      dinarWithoutFees: Number(value),
    });
    // onChangeForm({});
  };

  function getFeeAmana(amount: number) {
    for (let i = 0; i < fees.length; i++) {
      if (
        amount >= fees[i].fees.min_price &&
        amount <= fees[i].fees.max_price
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
    if (e.target.name === "phone") {
      const currentValuee = e.target.value.replace(/[^\d]/g, "");
      let currentValue = currentValuee.replace(/^0+/, "");

      setRequest((prevState) => ({
        ...prevState,
        phone: currentValue,
      }));
      onGetForm({
        ...request,
        phone: currentValue,
      });
    } else {
      setRequest({
        ...request,
        [e.target.name]: e.target.value,
      });
      onGetForm({
        ...request,
        [e.target.name]: e.target.value,
      });
    }
  };

  const [errorsForm, setErrorsFrom] = React.useState({
    firstname: null,
    lastname: null,
    address: null,
    ccp: null,
    key: null,
    phone: null,
    relation: null,
  });
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
            <p>We will transfer your money within 24 hours</p>
          </div>
          <div className="mt-2 mb-2">
            <label className="font-bold text-black">You send</label>
            <CurrencyFormat
              value={amount.euroWithoutFees}
              thousandSeparator={true}
              fixedDecimalScale={true}
              decimalScale={2}
              prefix={"€ "}
              allowNegative={false}
              className={`rounded-2xl mt-3${
                error.error ? " border-red focus:border-red border-2" : ""
              }  w-full h-12 text-bold text-pink-500`}
              onValueChange={(values: any) => {
                const { value } = values;
                // formattedValue = $2,223
                // value ie, 2223
                onChangeEuro(value);
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
                  &nbsp; fees
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
                    />{" "}
                  </div>
                  {getCurrentcyFormat({
                    currency: "EUR",
                    amount: amount.euro,
                  })}{" "}
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
                  DZD
                  {getCurrentcyFormat({
                    currency: "DZD",
                    amount: exchange?.amount || 0,
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
            <CurrencyFormat
              value={Number(amount.dinar)}
              thousandSeparator={true}
              fixedDecimalScale={true}
              decimalScale={2}
              prefix={"DZ "}
              allowNegative={false}
              className={`rounded-2xl mt-3${
                error.error ? " border-red focus:border-red border-2" : ""
              }  w-full h-12 text-bold text-pink-500`}
              onValueChange={(values: any) => {
                const { formattedValue, value } = values;
                // formattedValue = $2,223
                // value ie, 2223
                onChangeDinar(value);
              }}
            />
            {error.error ? (
              <span style={{ color: "red", fontSize: "12px" }}>
                {error?.msg}
              </span>
            ) : null}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div className="mt-2 mb-2 mr-2">
              <label className="font-bold text-black">
                First name of receiver
              </label>
              <input
                className="rounded-2xl mt-3   w-full h-12 text-bold text-pink-500"
                type={"text"}
                name="firstname"
                placeholder="First name"
                value={request.firstname}
                onBlur={(e) => {
                  onChangeForm(e);
                  if (
                    !validator.isLength(e.target.value, { min: 2, max: 15 })
                  ) {
                    setErrorsFrom({
                      ...errorsForm,
                      [e.target.name]: "First name is invalid",
                    });
                  }
                }}
                onChange={onChangeForm}
              />
              {errorsForm.firstname ? (
                <span className="text-red text-xs">{errorsForm.firstname}</span>
              ) : null}
            </div>
            <div className="mt-2 mb-2 ml-2">
              <label className="font-bold text-black">
                Last name of receiver
              </label>
              <input
                className="rounded-2xl mt-3   w-full h-12 text-bold text-pink-500"
                type={"text"}
                name="lastname"
                value={request.lastname}
                placeholder="Last name"
                onBlur={(e) => {
                  onChangeForm(e);
                  if (
                    !validator.isLength(e.target.value, { min: 2, max: 15 })
                  ) {
                    setErrorsFrom({
                      ...errorsForm,
                      [e.target.name]: "last name is invalid",
                    });
                  }
                }}
                onChange={onChangeForm}
              />
              {errorsForm.lastname ? (
                <span className="text-red text-xs">{errorsForm.lastname}</span>
              ) : null}
            </div>
          </div>
          <div className="mt-2 mb-2">
            <label className="font-bold text-black">Address of receiver</label>
            <input
              className="rounded-2xl mt-3   w-full h-12 text-bold text-pink-500"
              type={"text"}
              name="address"
              value={request.address}
              onChange={onChangeForm}
              placeholder=" ex: N 01  Rue G  Cité  Independence Alger "
              onBlur={(e) => {
                onChangeForm(e);
                if (!validator.isLength(e.target.value, { min: 3, max: 100 })) {
                  setErrorsFrom({
                    ...errorsForm,
                    [e.target.name]: "Address is invalid",
                  });
                }
              }}
            />
            {errorsForm.address ? (
              <span className="text-red text-xs">{errorsForm.address}</span>
            ) : null}
          </div>{" "}
        </>
      ) : (
        <>
          <div className="mt-2 mb-2">
            <label htmlFor="phone" className="font-bold text-black">
              Phone number of receiver
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "75px auto" }}>
              <div style={{ marginTop: "23px" }}>
                <span>🇩🇿 +213 </span>
              </div>
              <div>
                <input
                  className="rounded-2xl mt-3   w-full h-12 text-bold text-pink-500"
                  type="text"
                  name="phone"
                  maxLength={9}
                  minLength={9}
                  required
                  placeholder="664 466 466"
                  value={request.phone}
                  onBlur={(e) => {
                    onChangeForm(e);
                    if (
                      !validator.isLength(e.target.value, { min: 9, max: 9 })
                    ) {
                      setErrorsFrom({
                        ...errorsForm,
                        [e.target.name]: "Phone is invalid",
                      });
                    }
                  }}
                  onChange={onChangeForm}
                />
                {errorsForm.phone ? (
                  <span className="text-red text-xs">{errorsForm.phone}</span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-2 mb-2">
            <label className="font-bold text-black">
              Your relation with the receiver
            </label>
            <textarea
              placeholder="What’s your relation with the receiver?"
              className="rounded-2xl mt-3   w-full  text-bold text-pink-500"
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
              maxLength={500}
              onChange={onChangeForm}
              rows={3}
              cols={50}
            ></textarea>
            <span className="text-xs text-[#010101]">
              Characters left: {500 - request.details.length}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

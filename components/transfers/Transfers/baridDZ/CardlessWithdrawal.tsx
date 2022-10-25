import React from "react";
import CurrencyInput from "react-currency-input-field";

//@ts-ignore
// import CurrencyFormat from "react-currency-format";
import {
  financial,
  getCurrentcyFormat,
} from "../../../../utils/getCurrencyFormat";

import { CgMathEqual } from "react-icons/cg";
import { RiSubtractFill } from "react-icons/ri";
import { FiX } from "react-icons/fi";
import validator from "validator";
import { useAppDispatch, useAppSelector } from "../../../../hooks/useReduxHook";
import { globalState } from "../../../../features/globalSlice";
import { onGetFees } from "../../../../actions/actions";
import { getMaxSelectAmount } from "../../../../utils/getMaxSelectAmount";
import { AMOUNT_SELECTED } from "../../../../constants/constants";
import PlaceholderTransaction from "../../../placeholder/PlaceholderTransaction";
type Props = {
  step: number;
  wallet: number;
  onGetForm: (form: any) => void;
};

export default function CardlessWithdrawal({ step, onGetForm, wallet }: Props) {
  const [errorsForm, setErrorsFrom] = React.useState({
    firstname: null,
    lastname: null,
    address: null,
    phone_number: null,
    relation: null,
  });
  const [request, setRequest] = React.useState({
    firstname: "",
    lastname: "",
    method: "Retrait Sans Carte",
    amount: 1,
    exchange: 0,
    total_fee: 1,
    phone_number: "",
    relation: " ",
    details: "",
  });
  const [amount, setAmount] = React.useState({
    euro: 1,
    euroWithoutFees: 1,
    dinar: 1,
    dinarWithoutFees: 1,
  });
  const [optionLength, setoptionLength] = React.useState<any[]>([]);
  const { exchange, fees, firstFetchFees } = useAppSelector(globalState);
  const dispatch = useAppDispatch();
  function generateSelectOptions(): any[] {
    let index = 1;
    let selectOtion = [];
    while (index !== 26) {
      let fees = setFeeAmana(
        Number(index * AMOUNT_SELECTED) / Number(exchange?.amount)
      );
      let optionValue =
        Number(index * AMOUNT_SELECTED) / Number(exchange?.amount) +
        Number(fees);
      index++;
      selectOtion.push({
        disabled: optionValue > wallet,
      });
    }
    return selectOtion;
  }
  React.useEffect(() => {
    if (wallet) {
      setoptionLength(generateSelectOptions());
    }
  }, [wallet, setoptionLength]);

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

      onChangeDinar(2000);
    }
  }, [exchange, fees, setRequest]);

  const onChangeEuro = (value: number) => {
    setRequest({
      ...request,
      amount: value,
      total_fee: Number(getFeeAmana(value)),
    });
    setAmount({
      euro: value - Number(getFeeAmana(value)),
      euroWithoutFees: value,
      dinar: (value - Number(getFeeAmana(value))) * Number(exchange?.amount),
      dinarWithoutFees: value * Number(exchange?.amount),
    });
  };
  const onChangeDinar = (index: number) => {
    //make validation for max and min
    let value = index * 2000;
    if (value >= 100000) {
      value = 2000;
    }
    if (value < 2000) {
      value = 2000;
    }
    let fees = setFeeAmana(Number(value) / Number(exchange?.amount));

    setRequest({
      ...request,
      amount: Number(value) / Number(exchange?.amount) + Number(fees),
      total_fee: Number(fees),
    });
    setAmount({
      euro: Number(value) / Number(exchange?.amount),
      euroWithoutFees: Number(value) / Number(exchange?.amount) + Number(fees),
      dinar: Number(value),
      dinarWithoutFees: Number(value),
    });

    onGetForm({
      ...request,
      amount: Number(value) / Number(exchange?.amount) + Number(fees),
    });
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
    let name = e.target.name;
    let value = (e.target as any).value;

    if (name === "phone_number") {
      const currentValuee = e.target.value.replace(/[^\d]/g, "");
      let currentValue = currentValuee.replace(/^0+/, "");
      setRequest((prevState) => ({
        ...request,
        phone_number: currentValue,
      }));
      onGetForm({
        ...request,
        phone_number: currentValue,
      });
    } else if (name === "relation" || name === "details") {
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
            <p>We will transfer your money in the same day</p>
          </div>
          <div className="mt-2 mb-2">
            <label className="font-bold text-black"> You send</label>
            <CurrencyInput
              value={Number(amount.euroWithoutFees).toFixed(2)}
              prefix={"€ "}
              maxLength={10}
              allowDecimals={true}
              allowNegativeValue={false}
              disabled
              className="rounded-2xl mt-3   w-full h-12 text-bold text-pink-500"
              onValueChange={(value: any) => {
                // formattedValue = $2,223
                // value ie, 2223
                onChangeEuro(value || 1);
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
          <div className="mt-2 mb-4 ">
            <label htmlFor="country">Receiver gets</label>
            <select
              name="country"
              id="country"
              className="rounded-2xl mt-3   w-full h-12 text-bold text-pink-500"
              value={amount.dinar / AMOUNT_SELECTED}
              onChange={(e) => {
                onChangeDinar((e.target as any).value);
              }}
            >
              {optionLength?.map((item: any, index: number) => {
                return (
                  <option
                    key={`key-${index}`}
                    disabled={item?.disabled}
                    value={index + 1}
                  >
                    {getCurrentcyFormat({
                      currency: "DZD",
                      amount: (index + 1) * 2000,
                    })}
                  </option>
                );
              })}
            </select>
          </div>
        </>
      ) : (
        <>
          {" "}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div className="mt-2 mb-2 mr-2">
              <label className="font-bold text-black">
                First name of receiver
              </label>
              <input
                className={`rounded-2xl mt-3  ${
                  errorsForm.firstname
                    ? " border-red focus:border-red border-2"
                    : ""
                } w-full  text-bold text-pink-500`}
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
                Last name of receiver{" "}
              </label>
              <input
                className={`rounded-2xl mt-3  ${
                  errorsForm.lastname
                    ? " border-red focus:border-red border-2"
                    : ""
                } w-full  text-bold text-pink-500`}
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
            <label htmlFor="phone" className="font-bold text-black">
              Phone number of receiver
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "75px auto" }}>
              <div style={{ marginTop: "23px" }}>
                <span>🇩🇿 +213 </span>
              </div>
              <div>
                <input
                  className={`rounded-2xl mt-3  ${
                    errorsForm.phone_number
                      ? " border-red focus:border-red border-2"
                      : ""
                  } w-full  text-bold text-pink-500`}
                  type="text"
                  name="phone_number"
                  maxLength={9}
                  minLength={9}
                  required
                  placeholder="664 466 466"
                  value={request.phone_number}
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
                {errorsForm.phone_number ? (
                  <span className="text-red text-xs">
                    {errorsForm.phone_number}
                  </span>
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
              className={`rounded-2xl mt-3 ${
                errorsForm.relation
                  ? " border-red focus:border-red border-2"
                  : ""
              }  w-full  text-bold text-pink-500`}
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

import React from "react";
import CurrencyInput from "react-currency-input-field";
// import useExchange from "../../../../hooks/useExchange";
//@ts-ignore
// import CurrencyFormat from "react-currency-format";
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
import { isValidAmountTransferCCP } from "../../../../helpers/validationAmount";
import {
  CCP,
  MIN_AMOUNT_CCP_DZ,
  // MIN_AMOUNT_CCP_DZ
} from "../../../../constants/constants";
import PlaceholderTransaction from "../../../placeholder/PlaceholderTransaction";
import { getEuroFromDZD } from "../../../../utils/calculator";

type Props = {
  step: number;
  wallet: number;
  onGetForm: (form: any) => void;
};

export default function CCPPayement({ step, onGetForm, wallet }: Props) {
  const [request, setRequest] = React.useState({
    firstname: "",
    lastname: "",
    method: "Versment ccp",
    amount: 1,
    exchange: 0,
    total_fee: 1,
    address: "",
    relation: "",
    ccp: "",
    key: "",
    phone: "",
    details: "",
    isValid: true,
  });
  const [error, setError] = React.useState<any>({
    error: false,
    msg: "",
  });
  const [amount, setAmount] = React.useState<any>({
    euro: 1,
    euroWithoutFees: 1,
    dinar: 1,
    dinarWithoutFees: 1,
  });
  const [walletIsNotEnougth, setwalletIsNotEnougth] = React.useState(false);
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
      //onChangeEuro(amount.euroWithoutFees);
      onChangeDinar(MIN_AMOUNT_CCP_DZ);
    }
  }, [exchange, fees, setRequest]);

  const onChangeEuro = (value: any) => {
    // value = value ? parseFloat(value).toFixed(2) : value;
    let amountWithFees = value - Number(getFeeAmana(value));
    let isValid = isValidAmountTransferCCP({
      walletAmount: wallet * Number(exchange?.amount),
      currentAmount: amountWithFees * Number(exchange?.amount),
      minAmount: 1000,
      maxAmount: (2001 - Number(getFeeAmana(2001))) * Number(exchange?.amount),
      method: CCP,
    });

    setError(isValid);
    if (value) {
      onGetForm({
        ...request,
        isValid: isValid?.error,
        amount: value,
        total_fee: Number(getFeeAmana(value)),
      });
      setRequest({
        ...request,
        isValid: isValid?.error,
        amount: value,
        total_fee: Number(getFeeAmana(value)),
      });
      setAmount({
        euro: value - Number(getFeeAmana(value)),
        euroWithoutFees: value,
        dinar: Number(
          (Number(value) - Number(getFeeAmana(value))) *
            Number(exchange?.amount)
        ),
        dinarWithoutFees: Number(Number(value) * Number(exchange?.amount)),
      });
    } else {
      onGetForm({
        ...request,
        isValid: isValid?.error,
        amount: 0,
        total_fee: 0,
      });

      setRequest({
        ...request,
        isValid: isValid?.error,
        amount: 0,
        total_fee: 0,
      });

      setAmount({
        euro: "",
        euroWithoutFees: "",
        dinar: "",
        dinarWithoutFees: "",
      });
    }
  };
  const onChangeDinar = (value: any) => {
    // value = value ? parseFloat(value).toFixed(2) : value;
    // if (
    //   value === 1000 &&
    //   Number(value) / Number(exchange?.amount) + Number(fees) > wallet
    // ) {
    //   setwalletIsNotEnougth(true);
    //   return;
    // }
    // if (Number(value) / Number(exchange?.amount) + Number(fees) > wallet) {
    //   onChangeEuro(wallet);
    // } else {
    let isValid = isValidAmountTransferCCP({
      walletAmount: wallet * Number(exchange?.amount),
      currentAmount: Number(value) || 0,
      maxAmount: 2000 * Number(exchange?.amount),
      minAmount: 1000,
      method: CCP,
    });

    setError(isValid);
    if (value) {
      const exchanged = getEuroFromDZD({
        amount: value,
        fees: fees,
        exchange: exchange?.amount || 1,
      });

      // let fees = setFeeAmana(Number(value) / Number(exchange?.amount));
      onGetForm({
        ...request,
        isValid: isValid.error,
        amount: exchanged.amountWithoutFees,
        total_fee: exchanged.fees,
      });
      setRequest({
        ...request,
        isValid: isValid.error,
        amount: exchanged.amountWithoutFees,
        total_fee: exchanged.fees,
      });

      setAmount({
        euro: exchanged.amountWithoutFees,
        euroWithoutFees: exchanged.amount,
        dinar: value,
        dinarWithoutFees: value,
      });
    } else {
      onGetForm({
        ...request,
        isValid: isValid?.error,
        amount: 0,
        total_fee: 0,
      });
      setRequest({
        ...request,
        isValid: isValid?.error,
        amount: 0,
        total_fee: 0,
      });
      setAmount({
        euro: "",
        euroWithoutFees: "",
        dinar: "",
        dinarWithoutFees: "",
      });
    }

    // if (Number(value) / Number(exchange?.amount) + Number(fees) >= 1000001) {
    // } else {

    // }

    // }
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

  const onChangeForm = (e: any) => {
    setErrorsFrom({
      ...errorsForm,
      [e.target.name]: null,
    });

    if (e.target.name === "phone") {
      const currentValuee = e.target.value.replace(/[^\d]/g, "");
      let currentValue = currentValuee.replace(/^0+/, "");
      setRequest({
        ...request,
        phone: currentValue,
      });
      onGetForm({
        ...request,
        phone: currentValue,
      });
    } else if (e.target.name === "ccp" || e.target.name === "key") {
      setRequest({
        ...request,
        [e.target.name]: e.target.value.replace(/\D/g, ""),
      });
      onGetForm({
        ...request,
        [e.target.name]: e.target.value.replace(/\D/g, ""),
      });
    } else if (
      e.target.name === "address" ||
      e.target.name === "relation" ||
      e.target.name === "details"
    ) {
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

  const [errorsForm, setErrorsFrom] = React.useState({
    firstname: null,
    lastname: null,
    address: null,
    ccp: null,
    key: null,
    phone: null,
    relation: null,
  });
  if (walletIsNotEnougth)
    return (
      <div
        style={{
          backgroundColor: "#FFDBB9",
          fontSize: "14px",
          fontWeight: "bold",
          borderRadius: "15px",
          marginTop: "10p x",
          padding: "15px",
          margin: "20px 0",
        }}
      >
        <p>
          You Can&lsquo;t continue this proccess, you have only{" "}
          {getCurrentcyFormat({
            currency: "EUR",
            amount: wallet,
          })}
          |
          {getCurrentcyFormat({
            currency: "DZD",
            amount: wallet * Number(exchange?.amount),
          })}
          <br />
          if You want to sent meny you have to charge your account
        </p>
      </div>
    );
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
            <ul>
              <li>-Fill out the information below</li>
              <li>
                -money will be transferred within 24 hours from making your
                request
              </li>
            </ul>
          </div>
          <div className="mt-2 mb-2">
            <label className="font-bold text-black"> You send </label>
            <CurrencyInput
              value={amount.euroWithoutFees}
              prefix={"€ "}
              placeholder="You send"
              decimalsLimit={2}
              allowDecimals={true}
              allowNegativeValue={false}
              groupSeparator=" "
              decimalSeparator="."
              maxLength={7}
              className={`rounded-2xl mt-3${
                error.error ? " border-red focus:border-red border-2" : ""
              }  w-full h-12 text-bold text-pink-500`}
              onValueChange={(value: any) => {
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
                    amount: Number(getFeeAmana(amount.euroWithoutFees || 0)),
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
            <CurrencyInput
              value={amount.dinar}
              prefix={"DZD "}
              decimalsLimit={2}
              placeholder="Receiver gets"
              allowDecimals={true}
              allowNegativeValue={false}
              groupSeparator=" "
              decimalSeparator="."
              maxLength={9}
              className={`rounded-2xl mt-3${
                error.error ? " border-red focus:border-red border-2" : ""
              }  w-full h-12 text-bold text-pink-500`}
              onValueChange={(value: any) => {
                onChangeDinar(value);
              }}
            />{" "}
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
                className={`rounded-2xl mt-3${
                  errorsForm.firstname
                    ? " border-red focus:border-red border-2"
                    : ""
                }  w-full h-12 text-bold text-pink-500`}
                type={"text"}
                name="firstname"
                placeholder="First name"
                value={request.firstname}
                onBlur={(e) => {
                  onChangeForm(e);
                  if (
                    !validator.isLength(e.target.value, { min: 3, max: 15 })
                  ) {
                    setErrorsFrom({
                      ...errorsForm,
                      [e.target.name]: "Firstname is invalid",
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
                className={`rounded-2xl mt-3${
                  errorsForm.lastname
                    ? " border-red focus:border-red border-2"
                    : ""
                }  w-full h-12 text-bold text-pink-500`}
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
                      [e.target.name]: "lastname is invalid",
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
              className={`rounded-2xl mt-3${
                errorsForm.address
                  ? " border-red focus:border-red border-2"
                  : ""
              }  w-full h-12 text-bold text-pink-500`}
              type={"text"}
              name="address"
              value={request.address}
              onChange={onChangeForm}
              placeholder="ex: N 01  Rue G  Cité  Independence Alger"
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px" }}>
            <div className="mt-2 mb-2  mr-2">
              <label className="font-bold text-black">CCP of receiver </label>
              <input
                className={`rounded-2xl mt-3${
                  errorsForm.ccp ? " border-red focus:border-red border-2" : ""
                }  w-full h-12 text-bold text-pink-500`}
                name="ccp"
                type="text"
                pattern="\d{1,5}"
                placeholder="CCP of receiver"
                value={request.ccp}
                inputMode="numeric"
                required
                maxLength={14}
                minLength={7}
                onBlur={(e) => {
                  onChangeForm(e);
                  if (
                    !validator.isLength(e.target.value, { min: 7, max: 14 })
                  ) {
                    setErrorsFrom({
                      ...errorsForm,
                      [e.target.name]:
                        "CCP is invalid, it should be between 7 to 14 ",
                    });
                  }
                }}
                onChange={onChangeForm}
              />
              {errorsForm.ccp ? (
                <span className="text-red text-xs">{errorsForm.ccp}</span>
              ) : null}
            </div>
            <div className="mt-2 mb-2  ml-2">
              <label className="font-bold text-black">Clé</label>
              <input
                className={`rounded-2xl mt-3${
                  errorsForm.key ? " border-red focus:border-red border-2" : ""
                }  w-full h-12 text-bold text-pink-500`}
                type="text"
                placeholder="Clé"
                pattern="[0-9]*"
                inputMode="numeric"
                name="key"
                value={request.key}
                required
                maxLength={2}
                onBlur={(e) => {
                  onChangeForm(e);
                  if (!validator.isLength(e.target.value, { min: 2, max: 2 })) {
                    setErrorsFrom({
                      ...errorsForm,
                      [e.target.name]: "Key is invalid",
                    });
                  }
                }}
                onChange={onChangeForm}
              />
              {errorsForm.key ? (
                <span className="text-red text-xs">{errorsForm.key}</span>
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
                  className={`rounded-2xl mt-3${
                    errorsForm.phone
                      ? " border-red focus:border-red border-2"
                      : ""
                  }  w-full h-12 text-bold text-pink-500`}
                  type="text"
                  name="phone"
                  maxLength={9}
                  minLength={9}
                  inputMode="numeric"
                  required
                  placeholder="666 666 666"
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
              placeholder="Your relation with receiver"
              className={`rounded-2xl mt-3  ${
                errorsForm.relation
                  ? " border-red focus:border-red border-2"
                  : ""
              } w-full  text-bold text-pink-500`}
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

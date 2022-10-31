import React from "react";
// import CurrencyInput from "react-currency-input-field";
import validator from "validator";
//@ts-ignore
import CurrencyInput from "react-currency-input-field";
import {
  financial,
  getCurrentcyFormat,
} from "../../../utils/getCurrencyFormat";

import { CgMathEqual } from "react-icons/cg";
import { RiSubtractFill } from "react-icons/ri";
import { FiX } from "react-icons/fi";

import { useAppDispatch, useAppSelector } from "../../../hooks/useReduxHook";
import { globalState } from "../../../features/globalSlice";
import { onGetFees, onGetOffices } from "../../../actions/actions";
import { isValidAmountTransferBARIDIMOB } from "../../../helpers/validationAmount";
import PlaceholderTransaction from "../../placeholder/PlaceholderTransaction";
import { getEuroFromDZD } from "../../../utils/calculator";
type Props = {
  step: number;
  wallet: number;
  onGetForm: (form: any) => void;
};

export default function FromOffice({ step, onGetForm, wallet }: Props) {
  const [request, setRequest] = React.useState({
    firstname: "",
    lastname: "",
    method: "In Office",
    amount: 1222,
    exchange: 0,
    total_fee: 1,
    address: "",
    phone: "",
    relation: "",
    details: "",
    office: "",
    isValid: true,
  });
  const [amount, setAmount] = React.useState<any>({
    euro: 1.0,
    euroWithoutFees: 1.0,
    dinar: 1,
    dinarWithoutFees: 1,
  });
  const { exchange, DZOffices, fees, firstFetchFees, firstFetchDZOffices } =
    useAppSelector(globalState);

  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (firstFetchFees) {
      dispatch(onGetFees());
    }
    if (firstFetchDZOffices) {
      dispatch(onGetOffices({ country: "Algeria" }));
    }
  }, [firstFetchFees, firstFetchDZOffices]);

  React.useEffect(() => {
    if (exchange?.amount && !fees[0]?.preFees) {
      setRequest((prevState: any) => ({
        ...prevState,
        exchange: Number(exchange?.amount),
      }));

      onChangeDinar(1000);
    }
  }, [exchange, fees, setRequest]);
  React.useEffect(() => {
    onGetForm(request);
  }, [request]);
  React.useEffect(() => {
    if (DZOffices) {
      setRequest((prevState: any) => ({
        ...prevState,
        office:
          DZOffices[0]?.offices.country +
          "," +
          DZOffices[0]?.offices.city +
          "," +
          DZOffices[0]?.offices.address,
      }));
      // onGetForm({
      //   ...request,
      //   office:
      //     DZOffices[0]?.offices.country +
      //     "," +
      //     DZOffices[0]?.offices.city +
      //     "," +
      //     DZOffices[0]?.offices.address,
      // });
    }
  }, [DZOffices]);
  const [error, setError] = React.useState<any>({
    error: false,
    msg: "",
  });
  const onChangeEuro = (value: any) => {
    let amountWithFees = value - Number(getFeeAmana(value));
    let isValid = isValidAmountTransferBARIDIMOB({
      walletAmount: wallet * Number(exchange?.amount),
      currentAmount: amountWithFees * Number(exchange?.amount),
      minAmount: 1000,
      maxAmount:
        (200000 - Number(getFeeAmana(100000))) * Number(exchange?.amount),
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
    let isValid = isValidAmountTransferBARIDIMOB({
      walletAmount: wallet * Number(exchange?.amount),
      currentAmount: value,
      maxAmount: 200000,
      minAmount: 1000,
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
        amount: exchanged.totalAmount,
        total_fee: exchanged.fees,
      });
      setRequest({
        ...request,
        isValid: isValid.error,
        amount: exchanged.totalAmount,
        total_fee: exchanged.fees,
      });

      setAmount({
        euro: exchanged.amountAfterTax,
        euroWithoutFees: exchanged.totalAmount,
        dinar: value,
        dinarWithoutFees: value,
      });
    } else {
      onGetForm({
        ...request,
        isValid: true,
        amount: 0,
        total_fee: 0,
      });
      setRequest({
        ...request,
        isValid: true,
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
    if (name === "office") {
      setRequest({
        ...request,
        office:
          DZOffices[value]?.offices.country +
          "," +
          DZOffices[value]?.offices.city +
          "," +
          DZOffices[value]?.offices.address,
      });
      // onGetForm({
      //   ...request,
      //   office:
      //     DZOffices[value]?.offices.country +
      //     "," +
      //     DZOffices[value]?.offices.city +
      //     "," +
      //     DZOffices[value]?.offices.address,
      // });
    } else if (name === "phone") {
      const currentValuee = e.target.value.replace(/[^\d]/g, "");
      let currentValue = currentValuee.replace(/^0+/, "");

      setRequest({
        ...request,
        [e.target.name]: currentValue,
      });
      // onGetForm({
      //   ...request,
      //   [e.target.name]: currentValue,
      // });
    } else if (
      name === "firstname" ||
      name === "lastname" ||
      name === "relation" ||
      name === "details"
    ) {
      let text = value.replace(/\s+/g, " ");
      let currentValue = text.replace(/^ +/, "");
      const re = /^(?:(?=[\p{Script=Arabic}A-Za-z])\p{L}|\s)+$/u;

      if (re.test(currentValue)) {
        setRequest({
          ...request,
          [e.target.name]: currentValue,
        });
        // onGetForm({
        //   ...request,
        //   [e.target.name]: currentValue,
        // });
      }
    } else {
      setRequest({
        ...request,
        [e.target.name]: value,
      });
      // onGetForm({
      //   ...request,
      //   [e.target.name]: value,
      // });
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

  if (fees.length === 0 || DZOffices.length === 0 || fees[0]?.preFees)
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
            <p>
              The receiver will pick up the money from the office you choose
              below using their ID card
            </p>
          </div>

          <div className="mt-2 mb-2">
            <label className="font-bold text-black">You send</label>
            <CurrencyInput
              value={amount.euroWithoutFees}
              prefix={"€ "}
              decimalsLimit={2}
              placeholder="You send"
              allowDecimals={true}
              allowNegativeValue={false}
              groupSeparator=" "
              decimalSeparator="."
              maxLength={7}
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
                // formattedValue = $2,223
                // value ie, 2223

                onChangeDinar(value);
              }}
            />{" "}
            {error.error ? (
              <span style={{ color: "red", fontSize: "12px" }}>
                {error?.msg}
              </span>
            ) : null}
          </div>
          <div className="mt-2 mb-4 ">
            <label htmlFor="office">Select office:</label>
            <select
              name="office"
              id="office"
              className="rounded-2xl mt-3   w-full h-12 text-bold text-pink-500"
              onClick={onChangeForm}
            >
              {DZOffices?.map((item: any, index: number) => {
                return (
                  <option key={`key-${index}`} value={index}>
                    {item?.offices?.flag} {item?.offices?.country},{" "}
                    {item?.offices?.city}, {item?.offices?.address}
                  </option>
                );
              })}
            </select>
          </div>
        </>
      ) : (
        <>
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
                Last name of receiver{" "}
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
              placeholder="what’s your relation with the receiver ?"
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
              placeholder="enter any notes you want to add here"
              className="rounded-2xl mt-3   w-full  text-bold text-pink-500"
              name="details"
              value={request.details}
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

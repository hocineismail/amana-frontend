import React from "react";
import CurrencyInput from "react-currency-input-field";
import useExchange from "../../../hooks/useExchange";
//@ts-ignore
//import CurrencyFormat from "react-currency-format";
import {
  financial,
  getCurrentcyFormat,
} from "../../../utils/getCurrencyFormat";
import useFees from "../../../hooks/useFees";
import { CgMathEqual } from "react-icons/cg";
import validator from "validator";
import { RiSubtractFill } from "react-icons/ri";
import { FiX } from "react-icons/fi";
import useDelivery from "../../../hooks/useDelivery";
import { globalState } from "../../../features/globalSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks/useReduxHook";
import { onGetDeliveries } from "../../../actions/actions";
type Props = {
  step: number;
  wallet: number;
  exchange: any;
  onGetForm: (form: any) => void;
};

export default function HomeDelivery({
  step,
  wallet,

  onGetForm,
}: Props) {
  const [request, setRequest] = React.useState<any>({
    firstname: "",
    lastname: "",
    method: "Delivery",
    amount: 1,
    exchange: 0,
    total_fee: 1,
    address: "",
    delivery_price: 0,
    delivery_place: "",
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

  const { delivery, exchange, firstFetchDeliveries, fees } =
    useAppSelector(globalState);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (firstFetchDeliveries) {
      dispatch(onGetDeliveries());
    }
  }, [firstFetchDeliveries]);

  React.useEffect(() => {
    if (exchange?.amount && !fees[0]?.preFees) {
      setRequest((prevState: any) => ({
        ...prevState,
        exchange: Number(exchange?.amount),
      }));
      onChangeDinar(20000);
    }
  }, [exchange, fees, setRequest]);
  React.useEffect(() => {
    if (delivery && request.delivery_price === 0) {
      if (delivery.length > 0) {
        onChangeDelivery(0, 0);
        setRequest({
          ...request,
          delivery_place: delivery[0].delivery.place,
          delivery_price: delivery[0].delivery.price,
        });
        onChangeDelivery(0, 0);
      }
    }
  }, [delivery]);
  React.useEffect(() => {
    onGetForm(request);
  }, [request]);
  const [errorsForm, setErrorsFrom] = React.useState({
    firstname: null,
    lastname: null,
    address: null,
    ccp: null,
    key: null,
    phone: null,
    relation: null,
  });
  const onChangeEuro = (value: number) => {
    let amountValue = Number(value) <= wallet ? Number(value) : wallet;
    setRequest({
      ...request,
      amount: amountValue,
      total_fee: Number(getFeeAmana(amountValue)),
    });
    // onGetForm({
    //   ...request,
    //   amount: amountValue,
    //   total_fee: Number(getFeeAmana(amountValue)),
    // });
    setAmount({
      euro: amountValue - Number(getFeeAmana(amountValue)),
      euroWithoutFees: amountValue,
      dinar:
        (amountValue - Number(getFeeAmana(amountValue))) *
          Number(exchange?.amount) -
        request.delivery_price,
      dinarWithoutFees: amountValue * Number(exchange?.amount),
    });
  };
  const onChangeDinar = (value: Number) => {
    let fees = setFeeAmana(Number(value) / Number(exchange?.amount));
    // if (Number(value) / Number(exchange?.amount) + Number(fees) >= wallet) {
    //   onChangeEuro(wallet);
    // } else {
    setRequest({
      ...request,
      amount: Number(value) / Number(exchange?.amount) + Number(fees),
      total_fee: Number(fees),
    });
    // onGetForm({
    //   ...request,
    //   amount: Number(value) / Number(exchange?.amount) + Number(fees),
    //   total_fee: Number(fees),
    // });
    setAmount({
      euro:
        (Number(request.delivery_price) + Number(value)) /
        Number(exchange?.amount),
      euroWithoutFees:
        (Number(request.delivery_price) + Number(value)) /
          Number(exchange?.amount) +
        Number(fees),
      dinar: Number(value),
      dinarWithoutFees: Number(value),
    });

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

      setRequest((prevState: any) => ({
        ...prevState,
        phone: currentValue,
      }));
      // onGetForm({
      //   ...request,
      //   phone: currentValue,
      // });
    } else {
      setRequest((prevState: any) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
      // onGetForm({
      //   ...request,
      //   [e.target.name]: e.target.value,
      // });
    }
  };
  const onChangeDelivery = (value: any, oldPrice: number) => {
    let fees = setFeeAmana(Number(amount.dinar) / Number(exchange?.amount));

    setRequest({
      ...request,
      delivery_place: delivery[Number(value)].delivery.place,
      delivery_price: Number(delivery[Number(value)].delivery.price),
      amount: Number(amount.dinar) / Number(exchange?.amount) + Number(fees),
      total_fee: Number(fees),
    });
    setAmount({
      euro:
        (Number(delivery[Number(value)].delivery.price) +
          Number(amount.dinar)) /
        Number(exchange?.amount),
      euroWithoutFees:
        (Number(delivery[Number(value)].delivery.price) +
          Number(amount.dinar)) /
          Number(exchange?.amount) +
        Number(fees),
      dinar: Number(amount.dinar),
      dinarWithoutFees: Number(amount.dinar),
    });
  };

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
            <p>We will make your transfer within 24h</p>
          </div>
          <div className="mt-2 mb-4 ">
            <label htmlFor="country">Select office:</label>
            <select
              name="country"
              id="country"
              placeholder="Choose city"
              className="rounded-2xl mt-3   w-full h-12 text-bold text-pink-500"
              onClick={(e) =>
                onChangeDelivery(
                  (e.target as any).value,
                  request.delivery_price
                )
              }
            >
              {delivery?.map((item: any, index: number) => {
                return (
                  <option key={`key-${index}`} value={index}>
                    {item.delivery.place}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="mt-2 mb-2">
            <label className="font-bold text-black">You send</label>

            <CurrencyInput
              value={Number(amount.euroWithoutFees).toFixed(2)}
              prefix={"€ "}
              allowDecimals={true}
              allowNegativeValue={false}
              className={`rounded-2xl mt-3   w-full h-12 text-bold text-pink-500 ${
                amount.dinar < 19999
                  ? " border-2 border-red  focus:border-red"
                  : ""
              }`}
              onBlur={() => {
                // if (Number(amount.dinar) <= 20000) {
                //   onChangeDinar(20000);
                // } else if (amount.euroWithoutFees > wallet) {
                //   onChangeEuro(wallet);
                // }
              }}
              onValueChange={(value: any) => {
                // formattedValue = $2,223
                // value ie, 2223
                onChangeEuro(value || 1);
              }}
            />
          </div>
          <div style={{ position: "relative", height: "130px" }}>
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
                  {delivery.length < 1
                    ? "..."
                    : getCurrentcyFormat({
                        currency: "EUR",
                        amount: Number(
                          getFeeAmana(amount.euroWithoutFees || 1)
                        ),
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
                    currency: "DZD",
                    amount: request.delivery_price,
                  })}{" "}
                  delivery fees
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
            <label className="font-bold text-black">
              Receiver gets {Number(amount.dinar).toFixed(2)}
            </label>
            <CurrencyInput
              value={Number(amount.dinar).toFixed(2)}
              prefix={"DZD "}
              allowDecimals={true}
              allowNegativeValue={false}
              className={`rounded-2xl mt-3   w-full h-12 text-bold text-pink-500 ${
                amount.dinar < 19999
                  ? " border-2 border-red  focus:border-red"
                  : ""
              }`}
              onBlur={() => {
                // if (Number(amount.dinar) <= 20000) {
                //   onChangeDinar(20000);
                // } else if (amount.euroWithoutFees > wallet) {
                //   onChangeEuro(wallet);
                // }
              }}
              onValueChange={(value: any) => {
                // formattedValue = $2,223
                // value ie, 2223
                if (value) {
                  onChangeDinar(value);
                } else {
                  onChangeEuro(1);
                }
              }}
            />
            {amount.dinar < 19999 ? (
              <i style={{ color: "red", fontSize: "12px" }}>
                You have to send up then
                {(Number(request.delivery_price) + Number(20000)) /
                  Number(exchange?.amount) +
                  Number(setFeeAmana(Number(20000) / Number(exchange?.amount)))}
              </i>
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
                    !validator.isLength(e.target.value, { min: 3, max: 50 })
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
                    !validator.isLength(e.target.value, { min: 3, max: 50 })
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
              placeholder="ex: N 01  Rue G  Cité  Independence Alger  "
              onBlur={(e) => {
                onChangeForm(e);
                if (!validator.isLength(e.target.value, { min: 3, max: 50 })) {
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
          </div>
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
                  minLength={0}
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
              placeholder="What’s your relation with the receiver ?"
              className="rounded-2xl mt-3   w-full  text-bold text-pink-500"
              name="relation"
              value={request.relation}
              maxLength={100}
              onChange={onChangeForm}
              rows={3}
              cols={50}
              onBlur={(e) => {
                onChangeForm(e);
                if (
                  !validator.isLength(e.target.value, { min: 11, max: 100 })
                ) {
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

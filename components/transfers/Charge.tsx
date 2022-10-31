import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import React, { useEffect } from "react";

//@ts-ignore
import dynamic from "next/dynamic";
import { FiCopy } from "react-icons/fi";
import Swal from "sweetalert2";
// import { getCurrentcyFormat } from "../../utils/getCurrencyFormat";
import CurrencyInput from "react-currency-input-field";
import {
  onGetBanks,
  onGetCountries,
  onGetOffices,
} from "../../actions/actions";
import {
  CHARGE,
  MAX_AMOUNT_CHARGE_BANK,
  MAX_AMOUNT_CHARGE_CASH,
  MIN_AMOUNT_CHARGE_BANK,
  MIN_AMOUNT_CHARGE_CASH,
} from "../../constants/constants";

import { globalState } from "../../features/globalSlice";
import { userState } from "../../features/userSlice";
import { db } from "../../firebase/firebase";
import { isValidAmount } from "../../helpers/validationAmount";
import useBank from "../../hooks/useBank";
import useCountires from "../../hooks/useCountires";
import useCurrentUser from "../../hooks/useCurrentUser";
import useExchange from "../../hooks/useExchange";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import useGeneratorRef from "../../hooks/useGeneratorRef";

import { useAppDispatch, useAppSelector } from "../../hooks/useReduxHook";
import Card from "../common/card/Card";
import Radio from "../common/form/Radio";
import PlaceholderCharge from "../placeholder/PlaceholderCharge";

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: `text-white  bg-blue
              border border-blue
              hover:bg-blue  focus:ring-4 
              focus:ring-blue-300 font-medium 
              rounded-2xl text-sm px-5 py-2.5
              text-center mr-2 mb-2 dark:bg-blue-600 
            dark:hover:bg-blue dark:focus:ring-blue-800`,
    cancelButton: `text-[#000] bg-gray
              border border-gray
              hover:bg-gray  focus:ring-4 
              focus:ring-gray-300 font-medium 
              rounded-2xl text-sm px-5 py-2.5
              text-center mr-2 mb-2 dark:bg-gray-600 
            dark:hover:bg-gray dark:focus:ring-gray-800`,
  },
  buttonsStyling: false,
});
interface IMoney {
  moneyEuro: number;
  moneyDinar: number;
}
interface Props {
  onCloseModel: (display: boolean) => void;
}
export default function Charge({ onCloseModel }: Props) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState(false);
  const [refName, setrefName] = React.useState("");
  // i have to fetch offices and countries and banks for the first time
  const [form, setform] = React.useState<any>({
    country: "",
  });
  const [checked, setChecked] = React.useState<Number>(1);
  const [init, setinit] = React.useState<any>(true);
  const [error, setError] = React.useState<any>({
    error: false,
    msg: "",
  });
  const [office, setoffice] = React.useState<any>();
  const [steps, setsteps] = React.useState<Number>(1);
  const [Exchange, setExchange] = React.useState<IMoney>({
    moneyEuro: 0,
    moneyDinar: 0,
  });
  const {
    exchange,
    countries,
    firstFetchEUOffices,
    firstFetchCountries,
    firstFetchBanks,
    EUOffices,
    banks,
  } = useAppSelector(globalState);
  React.useEffect(() => {
    if (firstFetchCountries) {
      dispatch(onGetCountries());
    }
    if (firstFetchEUOffices) {
      dispatch(onGetOffices({ country: "Europ" }));
    }
    if (firstFetchBanks) {
      dispatch(onGetBanks());
    }
  }, [dispatch, firstFetchCountries, firstFetchEUOffices, firstFetchBanks]);

  React.useEffect(() => {
    if (exchange !== null) {
      setExchange({ ...Exchange, moneyDinar: Number(exchange.amount) });
    }
  }, [exchange?.amount]);

  const { currentUser } = useFirebaseAuth();
  const { reference, getNewRef } = useGeneratorRef();
  const { userDetails } = useAppSelector(userState);

  const { getFullDetails } = useCurrentUser();

  React.useEffect(() => {
    if (userDetails) {
      if (reference && checked == 1) {
        let arrayRef = banks[0]?.bank.ref.split("-");
        setrefName(arrayRef[0]);

        let colRef = collection(db, "requests");
        addDoc(colRef, {
          method: "By Bank",
          fullname: userDetails.fullname,
          phone_number: userDetails.phone,
          userId: currentUser.uid,
          country: userDetails.country,
          state: userDetails.state,
          address: userDetails.address,
          type: "Charge",
          target_bank: {
            account_name: banks[0]?.bank.account_name,
            bank_address: banks[0]?.bank.bank_address,
            iban: banks[0]?.bank.Iban,
            bank_name: banks[0]?.bank.bank_name,
            bic_swift: banks[0]?.bank.bic_swift,
          },
          exchange_fees: 0,
          description: `Deposit to wallet  €${Exchange.moneyEuro} - Bank Transfer`,
          status: "Awaiting",
          amount: Exchange.moneyEuro,
          referenceName: arrayRef[0],
          referenceNumber: reference,
          current_country: form.country
            ? form.country
            : countries[0]?.country.country,
          createdAt: serverTimestamp(),
        }).then(() => {
          setsteps(Number(steps) + 1);
          setLoading(false);
          // onCloseModel(false);
          // swalWithBootstrapButtons.fire(
          //   "Confirmed!",
          //   "You request has been sent",
          //   "success"
          // );
        });
      }
      if (checked == 2) {
        let colRef = collection(db, "requests");
        addDoc(colRef, {
          method: "By Office",
          fullname: userDetails.fullname,
          phone_number: userDetails.phone,
          userId: currentUser.uid,
          country: userDetails.country,
          state: userDetails.state,
          address: userDetails.address,
          type: "Charge",
          target_office: {
            country: office ? office.country : EUOffices[0]?.offices.country,
            city: office ? office.city : EUOffices[0]?.offices.city,
            address: office ? office.address : EUOffices[0]?.offices.address,
          },
          exchange_fees: 0,
          description: `Deposit to wallet  €${Exchange.moneyEuro} - Cash`,
          status: "Awaiting",
          amount: Exchange.moneyEuro,
          current_country: office
            ? office.country
            : EUOffices[0]?.offices.country,
          createdAt: serverTimestamp(),
        }).then(() => {
          setLoading(false);
          onCloseModel(false);
          swalWithBootstrapButtons.fire(
            "Confirmed!",
            "You request has been sent",
            "success"
          );
        });
      }
    }
  }, [reference, userDetails]);

  const createChargeRequest = async () => {
    if (steps === 1) {
      setLoading(true);
      if (!userDetails) {
        getFullDetails();
      }
      if (checked == 1) {
        // alert("hh");
        getNewRef();
      } else if (userDetails && checked === 2) {
        let colRef = collection(db, "requests");
        addDoc(colRef, {
          method: "By Office",
          fullname: userDetails.fullname,
          phone_number: userDetails.phone,
          userId: currentUser.uid,
          country: userDetails.country,
          state: userDetails.state,
          address: userDetails.address,
          type: "Charge",
          target_office: {
            country: office ? office.country : EUOffices[0]?.offices.country,
            city: office ? office.city : EUOffices[0]?.offices.city,
            address: office ? office.address : EUOffices[0]?.offices.address,
          },
          exchange_fees: 0,
          description: `Deposit to wallet  €${Exchange.moneyEuro} - Cash`,
          status: "Awaiting",
          amount: Exchange.moneyEuro,
          current_country: office
            ? office.country
            : EUOffices[0]?.offices.country,
          createdAt: serverTimestamp(),
        }).then(() => {
          setLoading(false);
          onCloseModel(false);
          swalWithBootstrapButtons.fire(
            "Confirmed!",
            "You request has been sent",
            "success"
          );
        });
      }
    } else {
      onCloseModel(false);
      swalWithBootstrapButtons.fire(
        "Confirmed!",
        "You request has been sent",
        "success"
      );
    }
  };
  const onCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(
        `Beneficiary name: ${banks[0]?.bank.account_name}\nBank address: ${
          banks[0]?.bank.bank_address
        }\nBank name: ${banks[0]?.bank.bank_name}\nIBAN: ${
          banks[0]?.bank.Iban
        }\nBIC/SWIFT: ${banks[0]?.bank.bic_swift}\nPayment Reference: ${
          refName + "-" + reference
        }`
      );
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <>
      {loading ? <div className="loading">Loading&#8230;</div> : null}
      <div data-aos="zoom-in">
        <div className="card-height flex  justify-center  items-center">
          <div
            className="card-dialog   
            box-shadow  
            w-[100%]  
            max-w-[550px] 
            m-0  
            p-4 
            md:m-5 
            md:p-10 
           bg-white 
           rounded-2xl  
            shadow-2xl 
            dark:bg-white
            "
          >
            <div className="relative">
              <div className="relative bg-black rounded-lg  dark:bg-gray-700">
                {EUOffices.length == 0 || countries.length === 0 ? (
                  <PlaceholderCharge />
                ) : (
                  <>
                    <div className="flex justify-between items-start  rounded-t ">
                      <h3
                        style={{ color: "black" }}
                        className="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-black"
                      >
                        Deposit To Wallet
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-black"
                        data-modal-toggle="defaultModal"
                        onClick={() => onCloseModel(false)}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>

                    {steps === 1 ? (
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
                            <li>
                              -Choose a way to deposit money to your wallet{" "}
                            </li>
                            <li>
                              -Enter the amount you want to deposit & read the
                              instructions carefully for a smooth process{" "}
                            </li>
                          </ul>
                        </div>
                        <div className="pt-6 pb-6 space-y-6">
                          <div>
                            <Radio
                              label=" Bank transfer"
                              checked={checked == 1}
                              onChange={(e) => {
                                setinit(false);
                                setError(
                                  isValidAmount({
                                    type: CHARGE,
                                    currentAmount: Number(Exchange.moneyEuro),
                                    maxAmount: MAX_AMOUNT_CHARGE_BANK,
                                    minAmount: MIN_AMOUNT_CHARGE_BANK,
                                  })
                                );
                                setChecked(Number(e));
                              }}
                              id="1"
                            />
                            <Radio
                              label="Cash"
                              checked={checked == 2}
                              onChange={(e) => {
                                setinit(false);
                                setError(
                                  isValidAmount({
                                    type: CHARGE,
                                    currentAmount: Number(Exchange.moneyEuro),
                                    maxAmount: MAX_AMOUNT_CHARGE_CASH,
                                    minAmount: MIN_AMOUNT_CHARGE_CASH,
                                  })
                                );
                                setChecked(Number(e));
                              }}
                              id="2"
                            />
                            <div className="mt-2 mb-2">
                              <label className="font-bold text-black">
                                You’re adding
                              </label>
                              <CurrencyInput
                                value={Exchange.moneyEuro}
                                prefix={"€ "}
                                placeholder="You’re adding"
                                decimalsLimit={2}
                                allowDecimals={true}
                                allowNegativeValue={false}
                                groupSeparator=" "
                                decimalSeparator="."
                                maxLength={10}
                                className={`rounded-2xl mt-3${
                                  error.error ? " border-red" : ""
                                }  w-full h-12 text-bold text-pink-500`}
                                onValueChange={(value: any) => {
                                  // formattedValue = $2,223
                                  // value ie, 2223
                                  if (checked === 1) {
                                    setError(
                                      isValidAmount({
                                        type: CHARGE,
                                        currentAmount: value || 0,
                                        maxAmount: MAX_AMOUNT_CHARGE_BANK,
                                        minAmount: MIN_AMOUNT_CHARGE_BANK,
                                      })
                                    );
                                  } else {
                                    setError(
                                      isValidAmount({
                                        type: CHARGE,
                                        currentAmount: value || 0,
                                        maxAmount: MAX_AMOUNT_CHARGE_CASH,
                                        minAmount: MIN_AMOUNT_CHARGE_CASH,
                                      })
                                    );
                                  }
                                  setinit(false);
                                  setExchange({
                                    ...Exchange,
                                    moneyEuro: value,
                                  });
                                }}
                              />
                              {error.error ? (
                                <span
                                  style={{ color: "red", fontSize: "12px" }}
                                >
                                  {error?.msg}
                                </span>
                              ) : null}
                            </div>
                            <div className="mt-2 mb-5">
                              <p
                                className="mb-3 font-sans  text-black dark:text-gray-400"
                                style={{ fontSize: "14px" }}
                              >
                                {!error.error ? (
                                  <>
                                    {error?.msg} <br />
                                  </>
                                ) : null}
                                Exchange rate today is €1 =
                                {exchange?.amount || "Loading..."} DZD
                              </p>
                            </div>
                            {checked === 1 ? (
                              <div className="mt-2 mb-2">
                                <label htmlFor="country">
                                  Country of your bank account:
                                </label>
                                <select
                                  name="country"
                                  id="country"
                                  className="rounded-2xl mt-3   w-full h-12 text-bold text-pink-500"
                                  onClick={(e) => {
                                    setform({
                                      ...form,
                                      country:
                                        countries[(e.target as any).value]
                                          ?.country?.country,
                                    });
                                  }}
                                >
                                  {countries?.map(
                                    (item: any, index: number) => {
                                      return (
                                        <option
                                          key={`key-${index}`}
                                          value={index}
                                        >
                                          {item?.country?.flag}{" "}
                                          {item?.country?.country}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              </div>
                            ) : (
                              <div className="mt-2 mb-2">
                                <label htmlFor="country">Our Office:</label>
                                <select
                                  name="country"
                                  id="country"
                                  className="rounded-2xl mt-3   w-full h-12 text-bold text-pink-500"
                                  onClick={(e) => {
                                    setoffice(
                                      EUOffices[(e.target as any).value]
                                        ?.offices
                                    );
                                  }}
                                >
                                  {EUOffices?.map(
                                    (item: any, index: number) => {
                                      return (
                                        <option
                                          key={`key-${index}`}
                                          value={index}
                                        >
                                          {item?.offices?.flag}{" "}
                                          {item?.offices?.country}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                                <div
                                  className="bg-[#6382975d]"
                                  style={{
                                    marginTop: "10px",
                                    fontSize: "16px",
                                    fontWeight: "normal",
                                    borderRadius: "15px",
                                    padding: "15px",
                                  }}
                                >
                                  <ul>
                                    <li>
                                      <b style={{ fontWeight: "bold" }}>
                                        Country{" "}
                                      </b>
                                      :{" "}
                                      {office
                                        ? office.country
                                        : EUOffices[0]?.offices.country}
                                    </li>
                                    <li>
                                      <b style={{ fontWeight: "bold" }}>
                                        City{" "}
                                      </b>
                                      :{" "}
                                      {office
                                        ? office.city
                                        : EUOffices[0]?.offices.city}
                                    </li>
                                    <li>
                                      <b style={{ fontWeight: "bold" }}>
                                        Address:{" "}
                                      </b>{" "}
                                      {office
                                        ? office.address
                                        : EUOffices[0]?.offices.address}
                                    </li>
                                    <li>
                                      <b style={{ fontWeight: "bold" }}>
                                        Phone:{" "}
                                      </b>
                                      {office
                                        ? office.phone
                                        : EUOffices[0]?.offices.phone}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
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
                            <li>
                              -Money will be added to your wallet from seconds
                              up to 3 business days depending on your bank
                            </li>
                            <li>-Copy account information below.</li>
                            <li>
                              -and make sure you enter the reference below when
                              making the transfer from your bank account.
                            </li>
                            <li>
                              -Your transfer will be added to the transactions
                              menu on the wallet page.
                            </li>
                          </ul>
                        </div>
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
                            <li>
                              -Transfer the amount you choose in the previous
                              step from your bank account to the account below.
                            </li>
                            <li>
                              -Confirm that you made the transfer on the
                              transactions menu after you make the transfer from
                              your bank account.
                            </li>
                          </ul>
                        </div>
                        <div>
                          <ul
                            style={{
                              fontSize: "16px",
                              marginTop: "20px",
                              marginBottom: "20px",
                            }}
                          >
                            <li
                              style={{
                                border: "1px solid gray",
                                padding: "5px",
                                borderTopLeftRadius: "10px",
                                borderTopRightRadius: "10px",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: "bolder",
                                }}
                              >
                                Copy All:
                              </span>
                              <span
                                className="tooltip-copy"
                                onClick={
                                  onCopyAll
                                  //() => {
                                  // navigator.clipboard.writeText(
                                  //   `Beneficiary name: ${
                                  //     banks[0]?.bank.account_name
                                  //   }\nBank address: ${
                                  //     banks[0]?.bank.bank_address
                                  //   }\nBank name: ${
                                  //     banks[0]?.bank.bank_name
                                  //   }\nIBAN: ${
                                  //     banks[0]?.bank.Iban
                                  //   }\nBIC/SWIFT: ${
                                  //     banks[0]?.bank.bic_swift
                                  //   }\nPayment Reference: ${
                                  //     refName + "-" + reference
                                  //   }`
                                  // );
                                  //}
                                }
                              >
                                <FiCopy
                                  size={18}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                />
                                <span className="tooltiptext">Copy</span>
                              </span>
                            </li>
                            <li
                              style={{
                                border: "1px solid gray",
                                padding: "5px",
                              }}
                            >
                              Beneficiary name: &nbsp;
                              <span style={{ fontWeight: "normal" }}>
                                {banks[0]?.bank.account_name}
                              </span>
                              <span
                                className="tooltip-copy"
                                onClick={async () => {
                                  await navigator.clipboard.writeText(
                                    `${banks[0]?.bank.account_name}`
                                  );
                                }}
                              >
                                <FiCopy
                                  size={18}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                />
                                <span className="tooltiptext">Copy</span>
                              </span>
                            </li>
                            <li
                              style={{
                                border: "1px solid gray",
                                padding: "5px",
                              }}
                            >
                              Bank address: &nbsp;
                              <span style={{ fontWeight: "normal" }}>
                                {banks[0]?.bank.bank_address}
                              </span>
                              <span
                                className="tooltip-copy"
                                onClick={async () => {
                                  await navigator.clipboard.writeText(
                                    `${banks[0]?.bank.bank_address}`
                                  );
                                }}
                              >
                                <FiCopy
                                  size={18}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                />
                                <span className="tooltiptext">Copy</span>
                              </span>
                            </li>
                            <li
                              style={{
                                border: "1px solid gray",
                                padding: "5px",
                              }}
                            >
                              IBAN:&nbsp;
                              <span style={{ fontWeight: "normal" }}>
                                {banks[0]?.bank.Iban}
                              </span>
                              <span
                                className="tooltip-copy"
                                onClick={async () => {
                                  await navigator.clipboard.writeText(
                                    `${banks[0]?.bank.Iban}`
                                  );
                                }}
                              >
                                <FiCopy
                                  size={18}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                />
                                <span className="tooltiptext">Copy</span>
                              </span>
                            </li>
                            <li
                              style={{
                                border: "1px solid gray",
                                padding: "5px",
                              }}
                            >
                              Bank name:&nbsp;
                              <span style={{ fontWeight: "normal" }}>
                                {banks[0]?.bank.bank_name}
                              </span>
                              <span
                                className="tooltip-copy"
                                onClick={async () => {
                                  await navigator.clipboard.writeText(
                                    `${banks[0]?.bank.bank_name}`
                                  );
                                }}
                              >
                                <FiCopy
                                  size={18}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                />
                                <span className="tooltiptext">Copy</span>
                              </span>
                            </li>
                            <li
                              style={{
                                border: "1px solid gray",
                                padding: "5px",
                              }}
                            >
                              BIC/SWIFT:&nbsp;
                              <span style={{ fontWeight: "normal" }}>
                                {banks[0]?.bank.bic_swift}
                              </span>
                              <span
                                className="tooltip-copy"
                                onClick={async () => {
                                  await navigator.clipboard.writeText(
                                    `${banks[0]?.bank.bic_swift}`
                                  );
                                }}
                              >
                                <FiCopy
                                  size={18}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                />
                                <span className="tooltiptext" id="myTooltip">
                                  Copy
                                </span>
                              </span>
                            </li>
                            <li
                              style={{
                                border: "1px solid gray",
                                padding: "5px",
                                borderBottomLeftRadius: "10px",
                                borderBottomRightRadius: "10px",
                              }}
                            >
                              Transfer Reference:&nbsp;
                              <span style={{ fontWeight: "normal" }}>
                                {refName + "-" + reference}
                              </span>
                              <span
                                className="tooltip-copy"
                                onClick={async () => {
                                  await navigator.clipboard.writeText(
                                    `${refName + "-" + reference}`
                                  );
                                }}
                              >
                                <FiCopy
                                  size={18}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                />
                                <span className="tooltiptext">Copy</span>
                              </span>
                            </li>
                          </ul>
                        </div>
                      </>
                    )}
                  </>
                )}

                <div className="flex justify-center  items-center  m-auto">
                  {checked === 2 ? (
                    <a
                      href={`https://wa.me/${
                        office ? office.phone : EUOffices[0]?.offices.phone
                      }?lang=en`}
                      className="w-[70%] mt-2 pl-10 pr-10   
                    fw-400 text-white bg-green
                      border border-green  h-12
                      justify-item 
                      hover:bg-green  focus:ring-4 
                      focus:ring-green-300 font-bold 
                      rounded-2xl  text-base px-5 py-2.5
                      text-center mr-2 mb-2 dark:bg-green-600 
                    dark:hover:bg-green dark:focus:ring-green-800
                      font-sans"
                    >
                      Call Us
                    </a>
                  ) : null}
                  <button
                    onClick={() => {
                      createChargeRequest();
                      // setsteps(Number(steps) + 1);
                    }}
                    disabled={
                      (checked === 1 && countries.length == 0) ||
                      (checked === 1 && banks.length == 0) ||
                      (checked === 2 && EUOffices.length == 0) ||
                      error.error ||
                      init
                    }
                    className={`w-[70%] mt-2 pl-10 pr-10    fw-400 text-white bg-${
                      error.error || init ? "gray" : "blue"
                    }
                    border border-${error.error || init ? "gray" : "blue"}  h-12
                    justify-item 
                    hover:bg-${
                      error.error || init ? "gray" : "blue"
                    }  focus:ring-4 
                    focus:ring-${
                      error.error || init ? "gray" : "blue"
                    }-300 font-bold 
                    rounded-2xl  text-base px-5 py-2.5
                    text-center mr-2 mb-2 dark:bg-${
                      error.error || init ? "gray" : "blue"
                    }-600 
                    dark:hover:bg-${
                      error.error || init ? "gray" : "blue"
                    } dark:focus:ring-${error.error ? "gray" : "blue"}-800
                    font-sans`}
                  >
                    {steps !== 1 ? "Confirm" : "Next"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
}

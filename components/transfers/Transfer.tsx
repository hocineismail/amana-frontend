import {
  collection,
  query,
  orderBy,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect } from "react";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";

import { getCurrentcyFormat } from "../../utils/getCurrencyFormat";
import BaridiMob from "./Transfers/baridDZ/BaridiMob";
import CardlessWithdrawal from "./Transfers/baridDZ/CardlessWithdrawal";
import CCPPayement from "./Transfers/baridDZ/CCPPayement";
import MoneyOrder from "./Transfers/baridDZ/MoneyOrder";

import FromOffice from "./Transfers/FromOffice";
import HomeDelivery from "./Transfers/HomeDelivery";
import { db } from "../../firebase/firebase";
import {
  validationBaridimob,
  validationCardLess,
  validationCCPpayment,
  validationDelivery,
  validationFromOffice,
  validationMoneyOrder,
} from "../../utils/validation";
import Swal from "sweetalert2";
import { RIP_FIXED } from "../../constants/constants";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxHook";
import { onGetFees } from "../../actions/actions";
import { globalState } from "../../features/globalSlice";
import { checkAvailablityTransaction } from "../../utils/checkAvailablityTransaction";

interface IMoney {
  moneyEuro: number;
  moneyDinar: number;
}
interface Props {
  onCloseModel: (display: boolean) => void;
  amountBlocked: Number;
  wallet: number;
  isLoading: (display: boolean) => void;
}

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
export default function Transfer({
  onCloseModel,
  amountBlocked,
  wallet,
  isLoading,
}: Props) {
  const dispatch = useAppDispatch();

  const { exchange, fees } = useAppSelector(globalState);
  const [step, setStep] = React.useState(0);

  const [reqestMoney, setReqestMoney] = React.useState<any>();
  const [data, setdata] = React.useState<any>();
  const [disabled, setdisabled] = React.useState<boolean>(true);

  const [amount, setAmount] = React.useState<Number>(0);
  const [method, setMethod] = React.useState<null | string>(null);
  const { currentUser } = useFirebaseAuth();
  const { firstFetchFees } = useAppSelector(globalState);

  React.useEffect(() => {
    if (firstFetchFees) {
      dispatch(onGetFees());
    }
  }, [dispatch, firstFetchFees]);
  React.useEffect(() => {
    if (method === "Baridi Mob" || method === "Retrait Sans Carte")
      setdisabled(false);
  }, [method]);

  const onSubmitCCPPayment = async (e: any) => {
    setdata(e);
    setdisabled(
      e.isValid || validationCCPpayment({ data: e, step: Number(step) - 1 })
    );
    setAmount(Number(e.amount));
    let fullname = e.firstname ? e.firstname + " " + e.lastname : "";
    setReqestMoney({
      method: e.method,
      fullname: fullname,
      phone_number: e.phone,
      address: e.address,
      target_ccp: {
        ccp: e.ccp,
        key: e.key,
      },
      exchange: exchange?.amount,
      exchange_fees: e.total_fee,
      description: `Transfer to ${
        e.firstname + " " + e.lastname
      } with ${getCurrentcyFormat({
        currency: "EUR",
        amount: e.amount,
      })} - Versment ccp`,
      amount: Number(e.amount),
      relation: e.relation,
      details: e.details,
    });
  };
  const onSubmitBaridiMob = async (e: any) => {
    setdata(e);
    setdisabled(
      e.isValid ||
        validationBaridimob({
          data: {
            method: "Baridi Mob",
            phone_number: e.phone,
            target_baridiMob: {
              RIP: RIP_FIXED + e.RIP,
            },
            exchange: exchange?.amount,
            exchange_fees: e.total_fee,
            description: `Transfer to ${
              RIP_FIXED + e.RIP
            } with ${getCurrentcyFormat({
              currency: "EUR",
              amount: e.amount,
            })} - Baridi mob`,
            amount: Number(e.amount),
            relation: e.relation,
            details: e.details,
          },
          step: Number(step) - 1,
        })
    );
    setAmount(Number(e.amount));
    setReqestMoney({
      method: "Baridi Mob",
      phone_number: e.phone,
      target_baridiMob: {
        RIP: RIP_FIXED + e.RIP,
      },
      exchange: exchange?.amount,
      exchange_fees: e.total_fee,
      description: `Transfer to ${RIP_FIXED + e.RIP} with ${getCurrentcyFormat({
        currency: "EUR",
        amount: e.amount,
      })} - Baridi mob`,
      amount: Number(e.amount),
      relation: e.relation,
      details: e.details,
    });
  };
  const onSubmitByOffice = async (e: any) => {
    setdisabled(
      e.isValid || validationFromOffice({ data: e, step: Number(step) - 1 })
    );

    setdata(e);
    let fullname = e.firstname ? e.firstname + " " + e.lastname : "";
    setAmount(Number(e.amount));

    setReqestMoney({
      method: e.method,
      fullname: fullname,
      phone_number: e.phone,
      exchange: exchange?.amount,
      office: e.office,
      exchange_fees: e.total_fee,
      description: `Transfer to ${
        e.firstname + " " + e.lastname
      } with ${getCurrentcyFormat({
        currency: "EUR",
        amount: e.amount,
      })} -In Office`,
      amount: Number(e.amount),
      relation: e.relation,
      details: e.details,
    });
  };

  const onSubmitCardLess = async (e: any) => {
    setdisabled(validationCardLess({ data: e, step: Number(step) - 1 }));
    setdata(e);
    setAmount(Number(e.amount));
    setReqestMoney({
      method: e.method,
      fullname: e.firstname + " " + e.lastname,
      phone_number: e.phone_number,
      exchange: exchange?.amount,
      exchange_fees: e.total_fee,
      description: `Transfer to ${
        e.firstname + " " + e.lastname
      } with ${getCurrentcyFormat({
        currency: "EUR",
        amount: e.amount,
      })} - Retrait Sans Carte`,
      amount: Number(e.amount),
      relation: e.relation,
      details: e.details,
    });
  };
  const onMoneyOrder = async (e: any) => {
    setdisabled(
      e.isValid || validationMoneyOrder({ data: e, step: Number(step) - 1 })
    );
    setdata(e);
    setAmount(Number(e.amount));
    setReqestMoney({
      method: e.method,
      fullname: e.firstname + " " + e.lastname,
      phone_number: e.phone,
      exchange: exchange?.amount,
      exchange_fees: e.total_fee,
      description: `Transfer to ${
        e.firstname + " " + e.lastname
      } with ${getCurrentcyFormat({
        currency: "EUR",
        amount: e.amount,
      })} - Mondat Algérie Poste`,
      amount: Number(e.amount),
      address: e.address,
      relation: e.relation,
      details: e.details,
    });
  };
  const onSubmitByDelivery = async (e: any) => {
    // setdisabled(validationDelivery({ data: e, step: Number(step) - 1 }));
    // setReqestMoney({
    //   method: e.method,
    //   fullname: e.firstname + " " + e.lastname,
    //   phone_number: e.phone,
    //   delivery_price_DZ: e.delivery_price,
    //   delivery_place: e.delivery_place,
    //   exchange: exchange?.amount,
    //   exchange_fees: e.total_fee,
    //   description: `Transfer to ${
    //     e.firstname + " " + e.lastname
    //   } with ${getCurrentcyFormat({
    //     currency: "EUR",
    //     amount: e.amount,
    //   })} - Delivery `,
    //   amount: Number(e.amount),
    //   address: e.address,
    //   relation: e.relation,
    //   details: e.details,
    // });
  };
  const onSubmit = async () => {
    const colRef = collection(db, "requests");

    let validation =
      method === "Versment ccp"
        ? validationCCPpayment({
            data: {
              ...reqestMoney,
              userId: currentUser.uid,
              type: "Transfer",
              status: "Awaiting",
              createdAt: serverTimestamp(),
            },
            general: true,
          })
        : method === "Baridi Mob"
        ? validationBaridimob({
            data: {
              ...reqestMoney,
              userId: currentUser.uid,
              type: "Transfer",
              status: "Awaiting",
              createdAt: serverTimestamp(),
            },
            general: true,
          })
        : method === "Retrait Sans Carte"
        ? validationCardLess({
            data: {
              ...reqestMoney,
              userId: currentUser.uid,
              type: "Transfer",
              status: "Awaiting",
              createdAt: serverTimestamp(),
            },
            general: true,
          })
        : null;
    if (!validation) {
      onCloseModel(false);

      addDoc(colRef, {
        ...reqestMoney,
        userId: currentUser.uid,
        type: "Transfer",
        status: "Awaiting",
        createdAt: serverTimestamp(),
      });
      const walletRed = doc(db, "users", currentUser.uid);
      const blocked = Number(amountBlocked) + Number(reqestMoney.amount);
      await updateDoc(walletRed, {
        amount_blocked: blocked.toFixed(2),
      });

      swalWithBootstrapButtons
        .fire("Confirmed!", "You request has been sent", "success")
        .then(() => {
          isLoading(false);
        });
    } else {
      isLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 2) {
      isLoading(true);
      onSubmit();
    } else {
      if (method === "Versment ccp") {
        setdisabled(validationCCPpayment({ data: data, step: 1 }));
      } else if (method === "In Office") {
        setdisabled(validationFromOffice({ data: data, step: 1 }));
      } else if (method === "Baridi Mob") {
        setdisabled(validationBaridimob({ data: data, step: 1 }));
      } else if (method === "Home Delivery") {
        setdisabled(validationDelivery({ data: data, step: 1 }));
      } else {
        setdisabled(validationCardLess({ data: data, step: 1 }));
      }

      setStep(Number(step) + 1);
    }
  };
  const lastStep = () => {
    if (step === 2)
      if (method === "Versment ccp") {
        setdisabled(validationCCPpayment({ data: data, step: 0 }));
      } else if (method === "In Office") {
        setdisabled(validationFromOffice({ data: data, step: 0 }));
      } else if (method === "Baridi Mob") {
        setdisabled(validationBaridimob({ data: data, step: 0 }));
      } else if (method === "Home Delivery") {
        setdisabled(validationDelivery({ data: data, step: 0 }));
      } else {
        setdisabled(validationCardLess({ data: data, step: 0 }));
      }
    setStep(Number(step) - 1);
  };
  return (
    <>
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
            <div className="relative ">
              <div className="relative bg-black rounded-lg   dark:bg-gray-700">
                <div className="flex justify-between items-start  rounded-t ">
                  <h3
                    style={{ color: "black" }}
                    className="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-black"
                  >
                    Transfer From Wallet
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
                <div>
                  {step === 0 ? (
                    <>
                      {[
                        "Algérie Poste",
                        "Versment ccp",
                        "Baridi Mob",
                        "Retrait Sans Carte",
                        "Mondat Algérie Poste",
                        "Cash Pickup",
                        "In Office",
                        "Home Delivery",
                      ].map((item: string, index) => {
                        if (item === "Algérie Poste" || item === "Cash Pickup")
                          return <h3 style={{ marginTop: "20px" }}>{item}</h3>;
                        if (item === "Home Delivery") {
                          return (
                            <div
                              style={{ textAlign: "left" }}
                              className="w-full mt-3 mb-3 pl-10 pr-10 
                            fw-400 text-black bg-gray
                            border border-gray  h-12
                            justify-item  cursor-not-allowed
                            hover:bg-gray  focus:ring-4 
                            focus:ring-gray-300 font-bold 
                            rounded-2xl  text-base px-5 py-2.5
                            text-center mr-2  dark:bg-gray-600 
                            dark:hover:bg-gray dark:focus:ring-gray-800
                            font-sans"
                            >
                              Home Delivery{" "}
                              <div
                                style={{
                                  float: "right",
                                  fontWeight: "normal",
                                  fontSize: "16px",
                                }}
                              >
                                Coming soon
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              setMethod(item);
                              setStep(step + 1);
                            }}
                            style={{ textAlign: "left", cursor: "pointer" }}
                            className="w-full mt-3 mb-3 pl-10 pr-10 
                            fw-400 text-white bg-blue
                            border border-blue  h-12
                            justify-item 
                            hover:bg-blue  focus:ring-4 
                            focus:ring-blue-300 font-bold 
                            rounded-2xl  text-base px-5 py-2.5
                            text-center mr-2  dark:bg-blue-600 
                            dark:hover:bg-blue dark:focus:ring-blue-800
                            font-sans"
                          >
                            {item}
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div>
                      <>
                        {
                          method === "Versment ccp" ? (
                            <CCPPayement
                              wallet={wallet}
                              onGetForm={(e) => onSubmitCCPPayment(e)}
                              step={step}
                            />
                          ) : method === "Baridi Mob" ? (
                            <BaridiMob
                              wallet={wallet}
                              onGetForm={(e) => onSubmitBaridiMob(e)}
                              step={step}
                            />
                          ) : method === "Retrait Sans Carte" ? (
                            <CardlessWithdrawal
                              wallet={wallet}
                              onGetForm={(e) => onSubmitCardLess(e)}
                              step={step}
                            />
                          ) : method === "Mondat Algérie Poste" ? (
                            <MoneyOrder
                              wallet={wallet}
                              onGetForm={(e) => onMoneyOrder(e)}
                              step={step}
                            />
                          ) : method === "In Office" ? (
                            <FromOffice
                              wallet={wallet}
                              onGetForm={(e) => onSubmitByOffice(e)}
                              step={step}
                            />
                          ) : null
                          // <HomeDelivery
                          //   wallet={wallet}
                          //   exchange={exchange}
                          //   onGetForm={(e) => onSubmitByDelivery(e)}
                          //   step={step}
                          // />
                        }
                      </>
                    </div>
                  )}
                </div>
                {fees.length === 0 || fees[0]?.preFees ? null : (
                  <div className="flex justify-center  items-center  m-auto">
                    {step !== 0 ? (
                      <>
                        <button
                          onClick={() => lastStep()}
                          className="w-[70%] mt-2 pl-10 pr-10    fw-400 text-black bg-gray
                      h-12
                    justify-item 
                    hover:bg-gray  focus:ring-4 
                    focus:ring-gray-300 font-bold 
                    rounded-2xl  text-base px-5 py-2.5
                    text-center mr-2 mb-2 dark:bg-gray-600 
                    dark:hover:bg-gray dark:focus:ring-gray-800
                    font-sans"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => nextStep()}
                          disabled={
                            wallet < 5 ||
                            disabled ||
                            checkAvailablityTransaction(
                              method || "",
                              wallet,
                              reqestMoney?.amount,
                              (reqestMoney?.amount -
                                reqestMoney?.exchange_fees) *
                                Number(exchange?.amount || 1)
                            )
                          }
                          className={`w-[70%] mt-2 pl-10 pr-10 
                        fw-400  ${
                          wallet < 5 ||
                          disabled ||
                          checkAvailablityTransaction(
                            method || "",
                            wallet,
                            reqestMoney?.amount,
                            (reqestMoney?.amount - reqestMoney?.exchange_fees) *
                              Number(exchange?.amount || 1)
                          )
                            ? "text-black bg-gray cursor-not-allowed hover:bg-gray dark:hover:bg-gray border border-gray"
                            : "text-white  bg-blue hover:bg-blue dark:hover:bg-blue  border border-blue"
                        }
                         h-12
                        justify-item 
                          focus:ring-4 
                        focus:ring-blue-300 font-bold 
                        rounded-2xl  text-base px-5 py-2.5
                        text-center mr-2 mb-2 dark:bg-blue-600 
                        dark:hover:bg-blue dark:focus:ring-blue-800
                        font-sans`}
                        >
                          {Number(step) === 2 ? "Confirm" : "Next"}
                        </button>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

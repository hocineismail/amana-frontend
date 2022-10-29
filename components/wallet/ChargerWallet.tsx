import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import React from "react";
import Moment from "react-moment";
import Swal from "sweetalert2";
import { onUpdateRightSidebarStatus } from "../../features/sidebarSlice";
import { db } from "../../firebase/firebase";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import { useAppDispatch } from "../../hooks/useReduxHook";
import { dateIsExpired } from "../../utils/dateIsExpired";
import { getCurrentcyFormat } from "../../utils/getCurrencyFormat";
import Badge from "../common/Badge/Badge";
import Placeholder from "../placeholder/Placeholder";

type Props = {
  amountBlocked: number;
};
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
const requestRef = collection(db, "requests");
export default function ChargerWallet({ amountBlocked }: Props) {
  const [transfer, setTransfer] = React.useState<any>([]);
  const { currentUser } = useFirebaseAuth();
  const [lastVisible, setlastVisible] = React.useState<any>();
  const [loading, setloading] = React.useState<boolean>(true);
  const [loadingOperation, setloadingOperation] =
    React.useState<boolean>(false);
  React.useEffect(() => {
    if (currentUser) {
      const statusQuery = query(requestRef, where("type", "==", "Charge"));
      const q = query(
        statusQuery,
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
        limit(10)
      );

      try {
        onSnapshot(q, (querySnapshot) => {
          setlastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
          const request = querySnapshot.docs.map((doc) => ({
            request: doc.data(),
            id: doc.id,
          }));
          setTransfer(request);
          setloading(false);
        });
      } catch (error) {
        setloading(false);
      }
    }
  }, [currentUser]);

  const onConfirmCharge = (item: any) => {
    setloadingOperation(true);
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `${
          item.request.method !== "By Office"
            ? `Have you made a transfer of  ${getCurrentcyFormat({
                currency: "EUR",
                amount: item.request.amount,
              })} from your bank account?!`
            : `Have you made a cash deposit of  ${getCurrentcyFormat({
                currency: "EUR",
                amount: item.request.amount,
              })} in our office?`
        }`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, I’ve made it!",
        cancelButtonText: "No, not yet!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const requestRef = doc(db, "requests", item.id);
          await updateDoc(requestRef, {
            status: "In Process",
          });
          setloadingOperation(false);
          swalWithBootstrapButtons.fire(
            "Confirmed!",
            "We’ll add your deposit to your wallet after processing it! ",
            "success"
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            `${
              item.request.method !== "By Office"
                ? `Please make the transfer from your bank account & then confirm this deposit!`
                : `Please make the cash deposit in our office and then confirm this deposit request!`
            }`,
            "error"
          );
          setloadingOperation(false);
        } else if (!result.isConfirmed) {
          setloadingOperation(false);
        }
      });
  };

  const onCanceledRequest = (item: any) => {
    setloadingOperation(true);
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `If You cancel your request, you can't charge your wallet with  ${getCurrentcyFormat(
          { currency: "EUR", amount: item.request.amount }
        )}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, I want to cancel!",
        cancelButtonText: "No, I want to keep it!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const requestRef = doc(db, "requests", item.id);
          await updateDoc(requestRef, {
            status: "Canceled",
          });
          // const walletRed = doc(db, "users", currentUser.uid);
          // await updateDoc(walletRed, {
          //   amount_blocked:
          //     Number(amountBlocked) - Number(item.request?.amount),
          // });
          setloadingOperation(false);
          swalWithBootstrapButtons.fire(
            "Confirmed!",
            "If you want to charge your wallet you have to add new request",
            "success"
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          setloadingOperation(false);
          swalWithBootstrapButtons.fire(
            "Cancelled",
            `We will keep your deposit request  :)`,
            "error"
          );
        } else if (!result.isConfirmed) {
          setloadingOperation(false);
        }
      });
  };
  const showNext = () => {
    setloading(true);
    if (!lastVisible) {
      // alert("Thats all we have for now !");
    } else {
      try {
        const statusQuery = query(requestRef, where("type", "==", "Charge"));
        const q = query(
          statusQuery,
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(10)
        );
        onSnapshot(q, (querySnapshot) => {
          setlastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
          const request = querySnapshot.docs.map((doc) => ({
            request: doc.data(),
            id: doc.id,
          }));
          setloading(false);
          setTransfer([...transfer, ...request]);
        });
      } catch (error) {
        setloading(false);
      }
    }
  };
  const dispatch = useAppDispatch();
  const onShowDetails = (item: any) => {
    dispatch(onUpdateRightSidebarStatus(item));
  };

  return (
    <>
      {loadingOperation ? <div className="loading">Loading&#8230;</div> : null}
      <div
        style={{ marginBottom: "30px", padding: "10px" }}
        className="border-gray-200 w-full rounded bg-white overflow-x-auto"
      >
        <table
          className="w-full leading-normal  "
          style={{ width: "100%", fontWeight: "bold", textAlign: "center" }}
        >
          <thead
            className="text-gray-600 text-xs font-semibold   
           text-left px-5 py-3 
           bg-gray-100  
           uppercase  "
            style={{
              textAlign: "left",
              margin: "10px",
              height: "70px",
            }}
          >
            <tr>
              <th
                className="bg-blue text-white pl-4 pr-4 rounded-l-2xl"
                style={{ width: "50px", textAlign: "center" }}
              >
                #
              </th>
              <th
                style={{ width: "30%" }}
                className="bg-blue text-white pl-4 pr-4  "
              >
                DESCRIPTION
              </th>
              <th
                className="bg-blue text-white pl-4 pr-4  "
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                TYPE
              </th>
              <th
                className="bg-blue text-white pl-4 pr-4  "
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                AMOUNT
              </th>
              <th
                className="bg-blue text-white pl-4 pr-4  "
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                STATUS
              </th>
              <th
                className="bg-blue text-white pl-4 pr-4 "
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                DATE
              </th>
              <th
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  textAlign: "center",
                  width: "300px",
                }}
                className="bg-blue text-white pl-4 pr-4  rounded-r-2xl"
              >
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {transfer.length === 0 && loading
              ? [1, 2, 3, 4, 5].map((item) => {
                  return (
                    <tr
                      key={item}
                      className="rounded-2xl"
                      style={{
                        margin: "10px",
                        height: "70px",

                        borderRadius: "100px",
                      }}
                    >
                      <td>
                        <Placeholder />
                      </td>
                      <td>
                        <Placeholder />
                      </td>
                      <td>
                        <Placeholder />
                      </td>
                      <td>
                        <Placeholder />
                      </td>
                      <td>
                        <Placeholder />
                      </td>
                      <td>
                        <Placeholder />
                      </td>
                      <td style={{ width: "150px" }}>
                        <Placeholder />
                      </td>
                    </tr>
                  );
                })
              : null}
            {transfer?.map((item: any, index: number) => {
              return (
                <tr
                  key={index}
                  className="rounded-2xl"
                  style={{
                    margin: "10px",
                    height: "70px",
                    borderRadius: "100px",
                  }}
                >
                  <td>{index + 1 < 10 ? `0${index + 1}` : index + 1}</td>
                  <td
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ minWidth: "200px" }}>
                      {item.request.description}
                    </div>
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    {item.request?.type === "Charge"
                      ? "Deposit"
                      : item.request?.type}
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: item.request.type === "Charge" ? "green" : "red",
                    }}
                  >
                    <div style={{ minWidth: "129px" }}>
                      {getCurrentcyFormat({
                        currency: "EUR",
                        amount: item.request?.amount,
                      })}
                    </div>
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    <div style={{ minWidth: "129px" }}>
                      {item.request?.type === "Charge" &&
                      item.request?.status === "Awaiting" &&
                      dateIsExpired({
                        date: item.request?.createdAt?.toDate().toString(),
                      }) ? (
                        <Badge
                          className={`text-white bg-red  border border-red
                          font-bold rounded-2xl text-sm px-5 py-2.5 text-center mr-2 mb-2`}
                          text={"Canceled"}
                        />
                      ) : (
                        <Badge
                          className={`text-white bg-${
                            item.request.status === "Awaiting"
                              ? "orange"
                              : item.request.status === "Canceled"
                              ? "red"
                              : item.request.status === "Confirmed"
                              ? "green"
                              : item.request.status === "In Process"
                              ? "blue"
                              : "gray"
                          }
                  border border-${
                    item.request.status === "Awaiting"
                      ? "orange"
                      : item.request.status === "Canceled"
                      ? "red"
                      : item.request.status === "Confirmed"
                      ? "green"
                      : item.request.status === "In Process"
                      ? "blue"
                      : "gray"
                  }
                  font-bold 
                rounded-2xl text-sm px-5 py-2.5
                text-center mr-2 mb-2`}
                          text={item.request?.status}
                        />
                      )}
                    </div>
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    {" "}
                    <div style={{ minWidth: "129px" }}>
                      <Moment fromNow>
                        {item.request?.createdAt?.toDate().toString()}
                      </Moment>
                    </div>
                  </td>{" "}
                  <td
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      textAlign: "right",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr ",
                        direction: "rtl",
                      }}
                    >
                      {" "}
                      <button
                        onClick={() => onShowDetails(item)}
                        className="text-black bg-gray
                      border border-gray
                      hover:bg-gray  focus:ring-4 
                      focus:ring-gray-300 font-medium 
                      rounded-2xl text-sm px-5 py-2.5
                      text-center mr-2 mb-2 dark:bg-gray-600 
                    dark:hover:bg-gray dark:focus:ring-gray-800"
                      >
                        Details
                      </button>
                      {item.request.status === "Awaiting" ? (
                        <>
                          {item.request.type === "Charge" &&
                          !dateIsExpired({
                            date: item.request?.createdAt?.toDate().toString(),
                          }) ? (
                            <button
                              onClick={() => onConfirmCharge(item)}
                              className="text-white bg-green
                                      border border-green
                                      hover:bg-green  focus:ring-4 
                                      focus:ring-green-300 font-medium 
                                      rounded-2xl text-sm px-5 py-2.5
                                      text-center mr-2 mb-2 dark:bg-green-600 
                                    dark:hover:bg-green dark:focus:ring-green-800"
                            >
                              Confirm
                            </button>
                          ) : null}
                          {!dateIsExpired({
                            date: item.request?.createdAt?.toDate().toString(),
                          }) ? (
                            <button
                              onClick={() => onCanceledRequest(item)}
                              className="text-white bg-red
                                border border-red
                                hover:bg-red  focus:ring-4 
                                focus:ring-red-300 font-medium 
                                rounded-2xl text-sm px-5 py-2.5
                                text-center mr-2 mb-2 dark:bg-red-600 
                              dark:hover:bg-red dark:focus:ring-red-800"
                            >
                              Cancel
                            </button>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>{" "}
      </div>
      {lastVisible ? (
        <div
          className="flex justify-center  items-center  m-auto  "
          style={{ maxWidth: "300px", width: "100%" }}
        >
          <button
            onClick={showNext}
            className="w-[70%] mt-2  mb-10  pl-10 pr-10 
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
            {loading ? (
              <div className="lds-ring">
                <div></div>
              </div>
            ) : (
              "More"
            )}
          </button>
        </div>
      ) : !loading ? (
        <div
          style={{
            margin: "30px 0",
            fontSize: "18px",
            fontWeight: "bold",
            width: "100%",
          }}
          className="text-center text-black"
        >
          <p>That’s all we have for now ! </p>
        </div>
      ) : null}
    </>
  );
}

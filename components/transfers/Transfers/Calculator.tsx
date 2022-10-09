import React from "react";

type Props = {};

export default function Calculator({}: Props) {
  return <div>Calculator</div>;
}
// import React from "react";
// // import CurrencyInput from "react-currency-input-field";
// import useExchange from "../../../hooks/useExchange";
// //@ts-ignore
// import CurrencyFormat from "react-currency-format";
// import { getCurrentcyFormat } from "../../../utils/getCurrencyFormat";
// import useFees from "../../../hooks/useFees";
// import { CgMathEqual } from "react-icons/cg";
// import { RiSubtractFill } from "react-icons/ri";
// import { FiX } from "react-icons/fi";

// type Props = {
//   onGetForm: (form: any) => void;
// };
// export default function Calculator({ onGetForm }: Props) {
//   const [amount, setAmount] = React.useState({
//     euro: 1,
//     euroWithoutFees: 1,
//     dinar: 1,
//     dinarWithoutFees: 1,
//   });
//   const fees = useFees();
//   const { exchange } = useExchange();

//   const onChangeEuro = (value: number) => {
//     onGetForm({
//       exchange: Number(exchange),
//       amount: Number(value) / Number(exchange) + Number(fees),
//       total_fee: Number(fees),
//     });
//     setAmount({
//       euro: value - Number(getFeeAmana(value)),
//       euroWithoutFees: value,
//       dinar: (value - Number(getFeeAmana(value))) * Number(exchange),
//       dinarWithoutFees: value * Number(exchange),
//     });
//   };
//   const onChangeDinar = (value: Number) => {
//     let fees = setFeeAmana(Number(value) / Number(exchange));
//     onGetForm({
//       exchange: Number(exchange),
//       amount: Number(value) / Number(exchange) + Number(fees),
//       total_fee: Number(fees),
//     });
//     setAmount({
//       euro: Number(value) / Number(exchange),
//       euroWithoutFees: Number(value) / Number(exchange) + Number(fees),
//       dinar: Number(value),
//       dinarWithoutFees: Number(value),
//     });
//   };

//   function getFeeAmana(amount: number) {
//     for (let i = 0; i < fees?.length; i++) {
//       if (
//         amount >= fees[i]?.fees.min_price &&
//         amount <= fees[i]?.fees.max_price
//       ) {
//         if (fees[i].fees.type === "fix") {
//           return Number(fees[i]?.fees.fee);
//         } else {
//           return (amount * Number(fees[i].fees.fee)) / 100;
//         }
//       }
//     }
//   }
//   function setFeeAmana(amount: number) {
//     let reversed = fees?.reverse();
//     console.log(reversed);
//     for (let i = 0; i < reversed.length; i++) {
//       let euroWithFees = amount + Number(reversed[i].fees.fee);
//       if (
//         euroWithFees >= reversed[i].fees.min_price &&
//         euroWithFees <= reversed[i].fees.max_price
//       ) {
//         return Number(reversed[i].fees.fee);
//       }
//     }
//   }

//   return (
//     <div>
//       {" "}
//       <div
//         style={{
//           backgroundColor: "#FFDBB9",
//           fontSize: "14px",
//           fontWeight: "bold",
//           borderRadius: "15px",
//           marginTop: "10px",
//           padding: "15px",
//         }}
//       >
//         <p>we wil transfer your moeny from your wallet</p>
//       </div>
//       <div className="mt-2 mb-2">
//         <label className="font-bold text-black">You are sending</label>
//         <CurrencyFormat
//           value={amount.euroWithoutFees}
//           thousandSeparator={true}
//           prefix={"€ "}
//           className="rounded-2xl mt-3   w-full h-12 text-bold text-pink-500"
//           onValueChange={(values: any) => {
//             const { value } = values;
//             // formattedValue = $2,223
//             // value ie, 2223
//             onChangeEuro(value);
//           }}
//         />
//       </div>
//       <div style={{ position: "relative", height: "99px" }}>
//         <div style={{ zIndex: 10, position: "absolute" }}>
//           <ul>
//             <li style={{ margin: "8px 20px" }}>
//               <div
//                 style={{
//                   display: "inline-block",
//                   width: "25px",
//                   height: "25px",
//                   paddingLeft: "3px",
//                   marginRight: "4px",
//                   background: "#002b48",
//                   borderRadius: "100%",
//                   zIndex: 10,
//                 }}
//               >
//                 <RiSubtractFill
//                   color="white"
//                   style={{
//                     marginBottom: "2px ",
//                     marginLeft: "1px",
//                     display: "inline-block",
//                     zIndex: 10,
//                   }}
//                 />
//               </div>
//               {getCurrentcyFormat({
//                 currency: "EUR",
//                 amount: Number(getFeeAmana(amount.euroWithoutFees || 1)),
//               })}
//               &nbsp; fees
//             </li>
//             <li style={{ margin: "8px 20px" }}>
//               <div
//                 style={{
//                   display: "inline-block",
//                   width: "25px",
//                   height: "25px",
//                   paddingLeft: "3px",
//                   marginRight: "4px",
//                   background: "#002b48",
//                   borderRadius: "100%",
//                 }}
//               >
//                 <CgMathEqual
//                   color="white"
//                   style={{
//                     display: "inline-block",
//                     marginBottom: "3px ",
//                     marginLeft: "2px",
//                   }}
//                 />{" "}
//               </div>
//               {getCurrentcyFormat({
//                 currency: "EUR",
//                 amount: amount.euro,
//               })}{" "}
//             </li>
//             <li style={{ margin: "8px 20px" }}>
//               <div
//                 style={{
//                   display: "inline-block",
//                   width: "25px",
//                   height: "25px",
//                   paddingLeft: "3px",
//                   marginRight: "4px",
//                   background: "#002b48",
//                   borderRadius: "100%",
//                 }}
//               >
//                 <FiX
//                   color="white"
//                   style={{
//                     display: "inline-block",
//                     marginBottom: "2px ",
//                     marginLeft: "2px",
//                   }}
//                 />
//               </div>
//               DA{" "}
//               {getCurrentcyFormat({
//                 currency: "DA",
//                 amount: exchange,
//               })}
//             </li>
//           </ul>
//         </div>
//         <div
//           style={{
//             position: "absolute",
//             top: 10,
//             bottom: 0,
//             width: "2px",
//             backgroundColor: "gray",
//             left: "32px",
//             zIndex: 1,
//           }}
//         ></div>
//       </div>
//       <div className="mt-2 mb-2">
//         <label className="font-bold text-black">Reccive</label>
//         <CurrencyFormat
//           value={amount.dinar}
//           thousandSeparator={true}
//           prefix={"DZ "}
//           className="rounded-2xl mt-3   w-full h-12 text-bold text-pink-500"
//           onValueChange={(values: any) => {
//             const { formattedValue, value } = values;
//             // formattedValue = $2,223
//             // value ie, 2223
//             onChangeDinar(value);
//           }}
//         />
//       </div>
//     </div>
//   );
// }

import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import {
  onBlockFetchBanks,
    onBlockFetchCountries,
    onBlockFetchDeliveries,
    onBlockFetchEUOffice,
  onBlockFetchFees,
  onSetAmounBlocked,
  onSetAmountAvailable,
  onSetBanks,
  onSetCountries,
  onSetDeliveries,
  onSetDZOffices,
  onSetEUOffices,
  onSetExchange,
  onSetfees,
} from "../features/globalSlice";
import { db } from "../firebase/firebase";

export function onGetExchange() {
  return function (dispatch: any) {
   
    const exchangeRef = collection(db, "exchange");
    const q = query(exchangeRef, orderBy("time", "desc"), limit(1)); 
    try {
      onSnapshot(q, (querySnapshot) => {
        const exchange_price = querySnapshot.docs.map((doc) => ({
          data: doc.data(),
        }));
  
        return dispatch(
          onSetExchange({
            exchange: {
              amount: exchange_price[0]?.data.exchange_price,
              createdAt: exchange_price[0]?.data.time.toDate().toString(),
            },
          })
        );
        // setExchange(exchange_price[0].data.exchange_price);
      });
    } catch (error) {
      return dispatch(
        onSetExchange({
          exchange: {
            amount: 0,
            createdAt: new Date(),
          },
        })
      );
    }
  };
}

export function onGetAmountBlocked() {
  return function (dispatch: any) {
    let uid = localStorage.getItem("userId") || "";
 
    onSnapshot(doc(db, "users", uid.toString()), (doc) => {
      let user = doc.data();
      return dispatch(
        onSetAmounBlocked({
          amountBlock: Number(user?.amount_blocked),
        })
      );
      // setExchange(exchange_price[0].data.exchange_price);
    });
  };
}

export function onGetAmountAvailable() {
  return function (dispatch: any) {
    let uid = localStorage.getItem("userId") || "";
    onSnapshot(doc(db, "wallets", uid.toString()), (doc) => {
      let wallet = doc.data();
 
      return dispatch(
        onSetAmountAvailable({
          amountAvailable: Number(wallet?.amount),
        })
      );
      // setExchange(exchange_price[0].data.exchange_price);
    });
  };
}

export function onGetCountries() {
  return function (dispatch: any) {
      dispatch(onBlockFetchCountries())
    const q = query(collection(db, "country"));
    onSnapshot(q, (querySnapshot) => {
      const countries = querySnapshot.docs.map((doc) => ({
        country: doc.data(),
      }));
      const sorted = countries.sort((a: any, b: any) =>
      a.country.country.localeCompare(b.country.country)
    );
      return dispatch(
        onSetCountries({
          countries: sorted,
        })
      );
    });
  };
}

export function onGetOffices({ country }: any) {
  return function (dispatch: any) {
 
    let officeRef = collection(db, "office");
 
    let q = query(
      officeRef,
      where("country", country === "Algeria" ? "==" : "!=", "Algeria")
    );
    onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        offices: doc.data(),
      }));
      if (country !== "Algeria") {
      
        const sorted = data.sort((a: any, b: any) =>
        a.offices.country.localeCompare(b.offices.country)
      );
     
        return dispatch(
          onSetEUOffices({
            EUOffices: sorted,
          })
        );
      } else {
        const sorted = [...data].sort((a: any, b: any) =>
        a.offices.country.localeCompare(b.offices.country)
      );
        return dispatch(
          onSetDZOffices({
            DZOffices: sorted,
          })
        );
      }
    });
  };
}


export function onGetBanks() {
  return function (dispatch: any) {
    dispatch(onBlockFetchBanks())
    const q = query(collection(db, "banks"), where("display","==", true));
    onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
         bank: doc.data(),
      }));
      return dispatch(
        onSetBanks({
          banks: data,
        })
      );
    });
  };
}
export function onGetDeliveries() {
  return function (dispatch: any) {
    dispatch(onBlockFetchDeliveries())
    const q = query(collection(db, "deliveries"));
    onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        delivery: doc.data(),
      }));
      return dispatch(
        onSetDeliveries({
          deliveries: data,
        })
      );
    });
  };
}
export function onGetFees() {
  return   function (dispatch: any) {
    dispatch(onBlockFetchFees())
    const q = query(collection(db, "fees_ranges"));  
    onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        fees: doc.data(),
      }));
      return dispatch(
        onSetfees({
          fees: data,
        })
      );
    });
     
     
  };
}
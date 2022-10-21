import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import { globalState } from "../features/globalSlice";
import { db } from "../firebase/firebase";
import { getReference } from "../utils/getReference";
import { useAppSelector } from "./useReduxHook";

export default function useGeneratorRef() {
  const [reference, setReference] = React.useState("");
  const [lastRef, setLastRef] = React.useState("");
  const { 
    banks,
  } = useAppSelector(globalState);


  React.useEffect(() => {
    if (lastRef) {
      let lastTRansferNumber = getReference(lastRef) + 3;
      const date = new Date();
      const last2Again = date.getFullYear().toString().slice(-2);
      /**
       * Generate new Reference for next request
       */

      setReference(lastTRansferNumber + "/" + last2Again);
    }
  }, [lastRef]);

  const getNewRef = async () => {
    // i should get the current ref name\
    // get last ref from request
 
    let arrayRef = banks[0] ?.bank.ref.split("-");
     
    // if exist will ad number
    //if not i create new ref
    /**
     * get last reference from last request
     */
    const requestRef = collection(db, "requests");
    const q = query(requestRef, orderBy("createdAt", "desc"), where("referenceName", "==", arrayRef[0]), limit(1)); 
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length !== 0) {
      querySnapshot.forEach((doc) => {
        const request = querySnapshot.docs.map((doc) => ({
          request: doc.data(),
        }));
        setLastRef(request[0].request.referenceNumber);
 
      });
    } else {
      const date = new Date();
      const last2Again = date.getFullYear().toString().slice(-2);
      setReference(arrayRef[1]+"/" + last2Again);
    }
  };
  const clearRef = () => {
    setLastRef("");
    setReference("");
  };
  return {
    reference,
    getNewRef,
    clearRef,
  };
}

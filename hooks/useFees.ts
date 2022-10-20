import { collection, getDocs, limit, query, where } from "firebase/firestore";
import React from "react";
import { db } from "../firebase/firebase";


export default function useFees() {
  const [fees, setFees] = React.useState<any>({
    fee: 0,
    price: 1,
    type: "fix",
  });
  const [loading, setloading] = React.useState<boolean>(true)
  React.useEffect(() => {
    getFees()
    return () => {
        setFees({
            fee: 0,
            price: 1,
            type: "fix",
          })
    }
  }, [setFees])
  
  const getFees = async () => {
    const feesRef = collection(db, "fees_ranges");
    const feesQuery = query(feesRef);
    const querySnapshot = await getDocs(feesQuery);
    querySnapshot.forEach((doc) => {
      const fees = querySnapshot.docs.map((doc) => ({
        fees: doc.data(),
      }));
      console.log(fees)
      setFees(fees);
      setloading(false)
    });
  };
  
  return {fees,loading}
}

import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { db } from "../firebase/firebase";
interface ICountry {
  country: string | undefined
}
export default function useOffices({country}: ICountry) {
  const [offices, setOffices] = React.useState<any>();
  React.useEffect(() => {
   if (country) {
    let officeRef =  collection(db, "office") 
     let q = query(officeRef, where("country", country === "Algeria" ?"==":"!=", country)) 
    onSnapshot(q, (querySnapshot) => {
 
      const data = querySnapshot.docs.map((doc) => ({
        offices: doc.data(),
      }));
      setOffices(data);
    });
   }
  }, [country]);
  return offices;
}

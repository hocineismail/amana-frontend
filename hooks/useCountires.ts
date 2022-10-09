import { collection, onSnapshot, query } from 'firebase/firestore';
import React from 'react'
import { db } from '../firebase/firebase';

 
export default function useCountires() {
    const [countries, setCountries] =  React.useState<any>([])
  React.useEffect(() => {
    const q = query(collection(db, "country"));
    onSnapshot(q, (querySnapshot) => {
      const countries = querySnapshot.docs.map((doc) => ({
         country: doc.data(),
      }));
 
    setCountries(countries)
    });
  },[setCountries])
  return countries 
}
import { collection, onSnapshot, query } from 'firebase/firestore';
import React from 'react'
import { db } from '../firebase/firebase';

 
export default function useBank() {
    const [bank, setBank] =  React.useState<any>()
  React.useEffect(() => {
    const q = query(collection(db, "banks"));
    onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
         bank: doc.data(),
      }));
      setBank(data);
    });
  },[setBank])
  return bank 
}
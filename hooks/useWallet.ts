// import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React from "react";
import { db } from "../firebase/firebase";
import { query, onSnapshot, limit, collection ,doc} from "firebase/firestore";
import useFirebaseAuth from "./useFirebaseAuth";
 
 
const uid = "gBTZdlAu1DYmIb8B2QZwFH7cYAn1"
export default function useWallet() {
  // const { currentUser } = useFirebaseAuth()
  const [wallet, setwallet] = React.useState<any>();
  const [walletValue, setwalletValue] = React.useState<any>();
  const [amountBlocked, setAmountBlocked] = React.useState<any>();
  const [loading, setloading] = React.useState<boolean>(true);
 
  React.useEffect(() => { 
  
    fetchWallet()
      
  
  }, []);

  React.useEffect(() => {  
    if (amountBlocked !== undefined && wallet!== undefined) {
      setloading(false); 
      setwalletValue(Number(wallet) - Number(amountBlocked))
    }
 
  }, [amountBlocked, wallet]);
  function fetchWallet() {
    onSnapshot(doc(db, "users",uid.toString()), (doc) => {
      let user = doc.data(); 
       setAmountBlocked(user?.amount_blocked) 
      //  setwallet( user?.wallet ) 
    })
    onSnapshot(doc(db, "wallets",uid.toString()), (doc) => {
      let wallet = doc.data();  
      setwallet(Number(wallet?.amount)) 
    });
  }
  return {
    walletValue,
    amountBlocked,
    loading,
  };
}

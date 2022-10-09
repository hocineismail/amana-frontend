import { collection, limit, onSnapshot, query } from "firebase/firestore";
import React from "react";
import { db } from "../firebase/firebase";

export default function useDelivery() {
  const [delivery, setDelivery] = React.useState<any[]>([]);
  const [loading, setloading] = React.useState<boolean>(true);
  React.useEffect(() => {
    const deliveryRef = collection(db, "deliveries")
    const q = query(deliveryRef);
    onSnapshot(q, (querySnapshot) => {
      const deliveries = querySnapshot.docs.map((doc) => ({
        delivery: doc.data(),
      })); 
      
      setloading(false);
      setDelivery(deliveries);
      //setDelivery(deliveries[0].data.exchange_price);
    });
  }, [setDelivery]);
  return { loading, delivery };
}

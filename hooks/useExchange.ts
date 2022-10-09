import { collection, limit, onSnapshot, query } from "firebase/firestore";
import React from "react";
import { db } from "../firebase/firebase";

export default function useExchange() {
  const [exchange, setExchange] = React.useState<Number>(0);
  const [createdAt, setcreatedAt] = React.useState();
  React.useEffect(() => {
    alert("test")
    const q = query(collection(db, "exchange"), limit(1));
    onSnapshot(q, (querySnapshot) => {
      console.log('test')
      const exchange_price = querySnapshot.docs.map((doc) => ({
        data: doc.data(),
      }));
      console.log(exchange_price)
      setExchange(exchange_price[0].data.exchange_price);
      setcreatedAt(exchange_price[0].data.time.toDate().toString());
      // setExchange(exchange_price[0].data.exchange_price);
    });
  }, []);
  return { exchange, createdAt };
}

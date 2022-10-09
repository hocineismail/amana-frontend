import { collection, limit, onSnapshot, query } from "firebase/firestore";
import React from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { exchangebitch, transferSwitchState } from "../features/transferSwitch";
import { db } from "../firebase/firebase";
import { useAppSelector } from "../hooks/useReduxHook";

export default function Test() {
  return (
    <div
      style={{
        backgroundColor: "gray",
        width: "500px",
        margin: "auto",
        position: "sticky",
      }}
    >
      <div
        style={{
          width: "250px",
          height: "25px",
          backgroundColor: "red",
          position: "absolute",
          zIndex: 1,
        }}
      ></div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", zIndex: 10 }}
      >
        <button>SIGN UP</button>
        <button>SIGN IN</button>
      </div>
    </div>
  );
}
